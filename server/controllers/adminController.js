const User = require("../models/User");
const Item = require("../models/Item");
const Request = require("../models/Request");

exports.getStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalItems = await Item.countDocuments();
  const totalRequests = await Request.countDocuments();
  const pendingItems = await Item.countDocuments({ status: "pending" });

  res.json({ totalUsers, totalItems, totalRequests, pendingItems });
};
exports.getPublicStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalRequests = await Request.countDocuments();

    res.json({ totalUsers, totalItems, totalRequests});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};