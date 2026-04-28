const Application = require("../models/Application");
const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");

exports.createApplication = async (req, res) => {
  try {
    console.log("FILE DEBUG:", req.file);
    console.log("BODY DEBUG:", req.body);

    const { jobId, name, email, phone, experience, linkedin, coverLetter } =
      req.body;

    if (!jobId || !name || !email) {
      return res
        .status(400)
        .json({ message: "jobId, name and email are required" });
    }

    const job = await Job.findById(jobId);
    console.log("job found:", job);
    console.log("isActive:", job?.isActive);

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.isActive === false)
      return res
        .status(400)
        .json({ message: "This job is no longer accepting applications" });

    const cv = req.file
      ? {
          url: req.file.path,
          public_id: req.file.filename,
          originalName: req.file.originalname,
        }
      : {};

    console.log("Creating application...");

    const application = await Application.create({
      job: jobId,
      name,
      email,
      phone,
      experience,
      linkedin,
      coverLetter,
      cv,
      status: "new",
    });

    console.log("Application created:", application._id);

    await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });

    res.status(201).json({
      message: "Application submitted successfully",
      data: application,
    });
  } catch (err) {
    console.log("ERROR MESSAGE:", err.message);
    console.log("ERROR STACK:", err.stack);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size must be under 5MB" });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { jobId, status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (jobId && jobId !== "all") filter.job = jobId;
    if (status && status !== "all") filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("job", "title dept location type"),
      Application.countDocuments(filter),
    ]);

    res.json({ applications, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate(
      "job",
      "title dept location type",
    );

    if (!app) return res.status(404).json({ message: "Not found" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const valid = ["new", "reviewing", "shortlisted", "rejected"];
    if (!valid.includes(status)) {
      return res
        .status(400)
        .json({ message: `Status must be one of: ${valid.join(", ")}` });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("job", "title dept location");

    if (!app) return res.status(404).json({ message: "Not found" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { note } = req.body;

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { note },
      { new: true },
    );

    if (!app) return res.status(404).json({ message: "Not found" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

    if (app.job) {
      await Job.findByIdAndUpdate(app.job, { $inc: { applications: -1 } });
    }

    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
