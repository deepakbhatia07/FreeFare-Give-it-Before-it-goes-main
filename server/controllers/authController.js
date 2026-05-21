const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const reverseGeocode = require("../utils/reverseGeocode");

/* ================= REGISTER ================= */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Register failed: user exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    console.log("✅ User registered:", user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    next(err);
  }
};

/* ================= LOGIN (NO MUTATION) ================= */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Login failed: user not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("❌ Login failed: wrong password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login success:", user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      location: user.location,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    next(err);
  }
};

/* ================= GET ME ================= */
exports.getMe = async (req, res) => {
  console.log("👤 GET /auth/me for:", req.user._id);
  res.json(req.user);
};

/* ================= UPDATE ME ================= */
exports.updateMe = async (req, res) => {
  console.log("🛠️ UPDATE /auth/me called");
  console.log("➡️ Request body:", req.body);

  if (req.user.isBanned) {
    console.log("⛔ Banned user attempted update");
    return res.status(403).json({
      message: "Banned users cannot update profile",
    });
  }

  const { name, email, avatar, location } = req.body;
  const updateData = { name, email, avatar };

  /* ===== GPS UPDATE ===== */
  if (location?.lat && location?.lng) {
    console.log("📍 GPS received:", location.lat, location.lng);

    const geo = await reverseGeocode(location.lat, location.lng);
    console.log("🗺️ Reverse geocode result:", geo);

    if (geo) {
      updateData.location = {
        ...geo,
        lat: location.lat,
        lng: location.lng,
        source: "gps",
      };
    } else {
      console.log("❌ Reverse geocode returned null");
    }
  }

  /* ===== MANUAL OVERRIDE ===== */
  else if (location?.city) {
    console.log("✍️ Manual location update:", location);

    updateData.location = {
      city: location.city,
      region: location.region || "",
      country: location.country || "",
      source: "manual",
    };
  }

  console.log("📦 Final update payload:", updateData);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  ).select("-password");

  console.log("✅ User updated:", updatedUser.location);

  res.json(updatedUser);
};

/* ================= ADMIN ================= */
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.toggleBan = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new Error("User not found");

  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot ban yourself" });
  }

  user.isBanned = !user.isBanned;
  await user.save();

  res.json({ message: `User ${user.isBanned ? "banned" : "unbanned"}` });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot delete yourself" });
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
};
