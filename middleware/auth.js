const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "No token, unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive)
      return res.status(401).json({ message: "User not found or deactivated" });

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
