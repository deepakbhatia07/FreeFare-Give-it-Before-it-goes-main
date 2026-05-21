const express = require("express");
const ChatMessage = require("../models/ChatMessage");
const Request = require("../models/Request");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/requests/:id/messages", protect, async (req, res) => {
  const request = await Request.findById(req.params.id)
    .populate("item")
    .populate("requester");

  if (!request) return res.status(404).json({ message: "Request not found" });

  const isRequester = request.requester._id.equals(req.user._id);
  const isOwner = request.item.user.equals(req.user._id);

  if (!isRequester && !isOwner)
    return res.status(403).json({ message: "Not allowed" });

  if (request.status !== "approved")
    return res.status(403).json({ message: "Chat not allowed" });

  const messages = await ChatMessage.find({ requestId: request._id })
    .populate("sender", "name")
    .sort("createdAt");

  res.json(messages);
});

module.exports = router;