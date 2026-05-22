const Item = require("../models/Item");
const fs = require("fs");
const path = require("path");
const Request = require("../models/Request");
const { delByPattern } = require('../utils/cacheUtils');
const formatItemImages = (item, req) => {
  return {
    ...item._doc,
    images: item.images.map(img => `${req.protocol}://${req.get("host")}/uploads/${img}`)
  };
};

// exports.getItems = async (req, res, next) => {
//   try {
//     const items = await Item.find().populate("user", "name email");
//     res.json(items.map(item => formatItemImages(item, req)));
//   } catch (err) {
//     next(err);
//   }
// };
exports.getItems = async (req, res, next) => {
  try {
    const { scope } = req.query;

    let query = {};

    // 📍 Location-based filtering (NEW)
    if (scope === "city" && req.user?.location?.city) {
      query["location.city"] = req.user.location.city;
    }

    if (scope === "state" && req.user?.location?.region) {
      query["location.region"] = req.user.location.region;
    }

    const items = await Item.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(items.map(item => formatItemImages(item, req)));
  } catch (err) {
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", "name email");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(formatItemImages(item, req));
  } catch (err) {
    next(err);
  }
};

exports.getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ user: req.user._id });
    res.json(items.map(item => formatItemImages(item, req)));
  } catch (err) {
    next(err);
  }
};

exports.filterItems = async (req, res, next) => {
  try {
    const { name, category, type, location } = req.query;
    let query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = category;
    if (type) {
      const typesArray = type.split(",");
      query.type = { $in: typesArray.map(t => t.trim().toLowerCase()) };
    }
    if (location) {
      query["location.city"] = { $regex: location, $options: "i" };
    }

    const items = await Item.find(query).populate("user", "name");
    res.json(items.map(item => formatItemImages(item, req)));
  } catch (err) {
    next(err);
  }
};

exports.getNewArrivals = async (req, res, next) => {
  try {
    const items = await Item.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("user", "name email");

    res.json(items.map(item => formatItemImages(item, req)));
  } catch (err) {
    next(err);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map(file => file.filename) : [];
    const { name, category, type, price, location, description } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }

    const item = await Item.create({
      name,
      category,
      type,
      price: type === "paid" ? price : "0",
       location: {
        city: req.user.location?.city || "",
        region: req.user.location?.region || "",
        country: req.user.location?.country || "",
      },
      description,
      images,
      user: req.user._id,
    });
    const { delByPattern } = require('../utils/cacheUtils');
// ... inside createItem, after item creation:
    delByPattern('cache:GET:/api/items*').catch(()=>{});
    delByPattern('cache:GET:/api/items/new-arrivals*').catch(()=>{});
    delByPattern('cache:GET:/api/admin/stats*').catch(()=>{});

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};



exports.updateItemStatus = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 
    const item = await Item.findByIdAndUpdate(id, { status }, { new: true });
    res.json(item);
  } catch (err) {
    next(err);
  }
};
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    if (item.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    for (const img of item.images) {
      const filePath = path.join(__dirname, '..', 'uploads', img);
      fs.unlink(filePath, (err) => { /* optionally log err */ });
    }

    await item.deleteOne();
    delByPattern(`cache:GET:/api/items/${req.params.id}`).catch(()=>{});
    delByPattern('cache:GET:/api/items*').catch(()=>{});
    delByPattern('cache:GET:/api/admin/stats*').catch(()=>{});
    await Request.deleteMany({ item: req.params.id });
    delByPattern('cache:GET:/api/requests*').catch(()=>{});
    
    res.json({ message: "Item deleted" });
  } catch (err) {
    next(err);
  }
};


exports.getPendingItems = async (req, res, next) => {
  try {
    const pendingItems = await Item.find({ status: 'pending' }).populate('user', 'name email');
    res.json(pendingItems);
  } catch (err) {
    next(err);
  }
};
exports.updateItemDetails = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    if (item.status === "approved" && req.user.role !== "admin") {
      return res.status(400).json({ message: "Cannot update item after approval" });
    }

    const allowedUpdates = ["name", "description", "category", "type", "price", "location", "images"];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });
    await item.save();
    res.json(item);
  } catch (err) {
    next(err);
  }
};
