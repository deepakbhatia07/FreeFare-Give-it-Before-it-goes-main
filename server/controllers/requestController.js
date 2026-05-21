const Request = require("../models/Request");
const Item = require("../models/Item");
const mongoose = require("mongoose");
const { delByPattern } = require('../utils/cacheUtils');

exports.createRequest = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot request your own item" });
    }
    if (item.status !== "approved") {
      return res.status(400).json({ message: "Item is not yet verified/approved by admin" });
    }
    if (item.taken) {
      return res.status(400).json({ message: "Item already taken" });
    }

    const existingRequest = await Request.findOne({
      item: itemId,
      requester: req.user._id,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "You have already requested this item" });
    }

    const request = await Request.create({
      item: itemId,
      requester: req.user._id,
    });
    delByPattern('cache:GET:/api/requests*').catch(()=>{});
    delByPattern('cache:GET:/api/requests/my*').catch(()=>{});
    delByPattern('cache:GET:/api/requests/received*').catch(()=>{});
    delByPattern(`cache:GET:/api/items/${itemId}`).catch(()=>{});

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

exports.updateRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { status } = req.body;
    const request = await Request.findById(id).populate("item").session(session);
    if (!request){
      await session.abortTransaction();
      return res.status(404).json({ message: "Request not found" });
    }
const itemOwnerId = request.item.user._id
  ? request.item.user._id.toString()
  : request.item.user.toString();

    if (req.user.role !== "admin" && itemOwnerId !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Not authorized to update this request" });
    }
     if (status === "approved") {
      // try to set taken only if not already taken (atomic)
      const updatedItem = await Item.findOneAndUpdate(
        { _id: request.item._id, taken: false },
        { $set: { taken: true } },
        { new: true, session }
      );
      if (!updatedItem) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Item is already taken" });
      }

      request.status = "approved";
      await request.save({ session });

      await Request.updateMany(
        { item: request.item._id, _id: { $ne: request._id }, status: "pending" },
        { $set: { status: "rejected" } },
        { session }
      );
    } else {
      request.status = status;
      await request.save({ session });
    }

    await session.commitTransaction();
    delByPattern('cache:GET:/api/requests*').catch(()=>{});
delByPattern('cache:GET:/api/requests/received*').catch(()=>{});
delByPattern('cache:GET:/api/requests/my*').catch(()=>{});

    session.endSession();
    // populate for response
    const populated = await Request.findById(request._id).populate({
      path: 'item',
      populate: { path: 'user', select: 'name' }
    }).populate('requester', 'name');
    res.json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
exports.getMyRequests = async (req, res) => {
  const requests = await Request.find({ requester: req.user._id })
    .populate({
      path: "item",
      populate: { path: "user", select: "name" }, 
    })
    .populate("requester", "name");
  res.json(requests);
};

// exports.getReceivedRequests = async (req, res) => {
//   const requests = await Request.find()
//     .populate({
//       path: "item",
//       populate: { path: "user", select: "name" }, 
//     })
//     .populate("requester", "name");

//   const myRequests = requests.filter(
//     (r) => r.item.user._id.toString() === req.user._id.toString()
//   );
//   res.json(myRequests);
// };
exports.getReceivedRequests = async (req, res) => {
  const requests = await Request.find()
    .populate({
      path: "item",
      match: { user: req.user._id }, // 🔑 filter at DB level
      populate: { path: "user", select: "name" },
    })
    .populate("requester", "name");

  // Remove requests where item didn't match
  const filtered = requests.filter(r => r.item !== null);

  res.json(filtered);
};


exports.cancelRequest = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.requester.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }
  if (req.user.role !== "admin" && request.status !== "pending") {
    return res.status(400).json({ message: "Cannot cancel request after it is approved/rejected" });
  }

  await request.deleteOne();
  delByPattern('cache:GET:/api/requests*').catch(()=>{});
delByPattern('cache:GET:/api/requests/received*').catch(()=>{});
delByPattern('cache:GET:/api/requests/my*').catch(()=>{});
  res.json({ message: "Request deleted" });
};
