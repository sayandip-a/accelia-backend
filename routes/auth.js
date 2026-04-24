// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN ATTEMPT:", req.body.email);
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email }).select("+password");
    console.log("ADMIN FOUND:", !!admin);

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!admin.isActive)
      return res.status(403).json({ message: "Account deactivated" });

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id);
    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", authMiddleware, (req, res) => {
  res.json({ admin: req.admin });
});
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id).select("+password");
    if (!(await admin.comparePassword(currentPassword)))
      return res.status(400).json({ message: "Current password incorrect" });
    admin.password = newPassword;
    await admin.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { name, avatar },
      { new: true },
    );
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
