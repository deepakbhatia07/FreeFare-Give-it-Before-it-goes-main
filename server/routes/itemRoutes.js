const express = require("express");
const { createItem, getItems,getNewArrivals, updateItemStatus,filterItems,getItem,getMyItems,updateItemDetails,deleteItem,getPendingItems } = require("../controllers/itemController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateMiddleware");
const { debounceRequests } = require("../middlewares/debounceMiddleware");
const cache = require('../middlewares/cacheMiddleware');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Item = require("../models/Item");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), 
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, JPG are allowed"), false);
};

const upload = multer({ storage, fileFilter });


router.get("/pending", protect, adminOnly, async (req, res) => {
  try {
    const pendingItems = await Item.find({ status: "pending" }).populate("user", "name email");
    res.json(pendingItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", protect, apiLimiter,debounceRequests(3000),upload.array("images"), createItem);
router.get("/",cache(15), getItems);
router.get("/filter", cache(20),filterItems);
router.get("/new-arrivals", cache(20),getNewArrivals);
router.get("/my", protect,cache(30), getMyItems);
router.get('/pending', protect, adminOnly, getPendingItems);
router.get("/:id", getItem);
router.put("/:id", protect, updateItemDetails);
router.delete("/:id", protect, deleteItem);
router.put("/:id/status", protect, adminOnly, updateItemStatus);

module.exports = router;
