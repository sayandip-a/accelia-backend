const Job = require("../models/Job");

// GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {
    const filter = req.query.admin ? {} : { isActive: true };

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");

    const total = await Job.countDocuments(filter);

    res.status(200).json({ jobs, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE JOB
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name");

    if (!job) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE JOB
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.admin._id,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// APPLY JOB (increment applications)
exports.applyJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { applications: 1 } },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Application recorded" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
