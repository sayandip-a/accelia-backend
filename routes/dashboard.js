const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Example dashboard stats
router.get("/", auth, async (req, res) => {
  try {
    res.json({
      message: "Dashboard data",
      stats: {
        users: 10,
        news: 5,
        jobs: 3,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; // ✅ VERY IMPORTANT
