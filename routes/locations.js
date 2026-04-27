const express = require("express");
const router = express.Router();
const Location = require("../models/Location");
const auth = require("../middleware/auth");

// GET all locations (public)
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find().sort({ order: 1 });
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create location (admin only)
router.post("/", auth, async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.json({ location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update location (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE location (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
