// routes/applications.js
const express = require("express");
const multer = require("multer");
const Application = require("../models/Application");
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or Word documents are accepted"), false);
    }
  },
});
router.post("/", upload.single("cv"), async (req, res) => {
  try {
    const { jobId, jobTitle, department, location, name, email, phone } =
      req.body;

    if (!jobId || !name || !email) {
      return res
        .status(400)
        .json({ message: "jobId, name and email are required" });
    }
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    let cvPayload = {};
    if (req.file) {
      cvPayload = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer.toString("base64"),
      };
    }

    const application = await Application.create({
      job: jobId,
      jobTitle,
      department,
      location,
      name,
      email,
      phone,
      cv: cvPayload,
    });
    await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });

    res.status(201).json({
      message: "Application submitted successfully",
      id: application._id,
    });
  } catch (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size must be under 5MB" });
    }
    res.status(500).json({ message: err.message });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const { jobId, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (jobId) filter.job = jobId;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("job", "title dept location")
        .select("-cv.data"),
      Application.countDocuments(filter),
    ]);

    res.json({ applications, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "job",
      "title dept location",
    );
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/:id/cv", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application || !application.cv?.data) {
      return res.status(404).json({ message: "CV not found" });
    }

    const buffer = Buffer.from(application.cv.data, "base64");
    res.set({
      "Content-Type": application.cv.mimetype,
      "Content-Disposition": `attachment; filename="${application.cv.filename}"`,
      "Content-Length": buffer.length,
    });
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["new", "reviewing", "shortlisted", "rejected"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
