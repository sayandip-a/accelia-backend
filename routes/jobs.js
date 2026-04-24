// routes/jobs.js
const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filter = req.query.admin ? {} : { isActive: true };
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    const total = await Job.countDocuments(filter);
    res.json({ jobs, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name");
    if (!job) return res.status(404).json({ message: "Not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.admin._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ message: "Not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment applications
router.post("/:id/apply", async (req, res) => {
  try {
    await Job.findByIdAndUpdate(req.params.id, { $inc: { applications: 1 } });
    res.json({ message: "Application recorded" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
