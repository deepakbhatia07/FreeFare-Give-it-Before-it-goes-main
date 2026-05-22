const express = require("express");
const { createRequest, updateRequest,getMyRequests,getReceivedRequests,cancelRequest } = require("../controllers/requestController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { debounceRequests } = require("../middlewares/debounceMiddleware");
const router = express.Router();

router.post("/", protect, debounceRequests(3000),createRequest);
router.get("/received", protect, getReceivedRequests);
router.put("/:id", protect,updateRequest);
router.get("/my", protect, getMyRequests);
router.delete("/:id", protect, cancelRequest);

module.exports = router;