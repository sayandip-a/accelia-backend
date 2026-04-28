const Application = require("../models/Application");
const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");

// ============================
// CREATE APPLICATION
// ============================
exports.createApplication = async (req, res) => {
  try {
    console.log("FILE DEBUG:", req.file); // ✅ IMPORTANT

    const { jobId, jobTitle, department, location, name, email, phone } =
      req.body;

    if (!jobId || !name || !email) {
      return res.status(400).json({
        message: "jobId, name and email are required",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    let cvPayload = {};

    if (req.file) {
      cvPayload = {
        url: req.file.path,
        public_id: req.file.filename,
        originalName: req.file.originalname,
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

    await Job.findByIdAndUpdate(jobId, {
      $inc: { applications: 1 },
    });

    res.status(201).json({
      message: "Application submitted successfully",
      data: application,
    });
  } catch (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size must be under 5MB",
      });
    }
    res.status(500).json({ message: err.message });
  }
};

// ============================
// GET ALL
// ============================
exports.getApplications = async (req, res) => {
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
        .populate("job", "title dept location"),
      Application.countDocuments(filter),
    ]);

    res.json({ applications, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// GET ONE
// ============================
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate(
      "job",
      "title dept location",
    );

    if (!app) return res.status(404).json({ message: "Not found" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// GET CV URL
// ============================
exports.getCVUrl = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app?.cv?.url) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json({ url: app.cv.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// UPDATE STATUS
// ============================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const valid = ["new", "reviewing", "shortlisted", "rejected"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// DELETE
// ============================
exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) return res.status(404).json({ message: "Not found" });

    if (app.cv?.public_id) {
      await cloudinary.uploader.destroy(app.cv.public_id, {
        resource_type: "raw",
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
