const express = require("express");
const { getPublicStats } = require("../controllers/adminController");
const cache = require('../middlewares/cacheMiddleware');
const router = express.Router();

router.get("/stats",cache(30),getPublicStats);

module.exports = router;
