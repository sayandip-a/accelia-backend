module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("TOKEN:", token); // 👈 DEBUG

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded); // 👈 DEBUG

    const admin = await Admin.findById(decoded.id);

    console.log("ADMIN:", admin); // 👈 DEBUG

    if (!admin || !admin.isActive)
      return res.status(401).json({ message: "Admin invalid" });

    req.admin = admin;
    next();
  } catch (err) {
    console.log("ERROR:", err.message); // 👈 DEBUG
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
