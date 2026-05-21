const express = require("express");
const { register, login, getMe,updateMe,getAllUsers,toggleBan,deleteUser } = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { apiLimiter } = require("../middlewares/rateMiddleware");
router.post('/register',apiLimiter,
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
     return register(req, res, next);
});
router.post("/login",apiLimiter, login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/all", protect, adminOnly, getAllUsers);
router.put("/:id/ban", protect, adminOnly, toggleBan);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
