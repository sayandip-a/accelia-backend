const Job = require("../models/Job");
const Application = require("../models/Application");
const Event = require("../models/Event");
const News = require("../models/News");
const Solution = require("../models/Solution");
const Location = require("../models/Location");

exports.getDashboard = async (req, res) => {
  try {
    // ===== BASIC STATS =====
    const [
      totalTrials,
      totalPatients,
      openJobs,
      activeSolutions,
      newsCount,
      eventCount,
      locations,
    ] = await Promise.all([
      Event.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Solution.countDocuments({ isActive: true }),
      News.countDocuments(),
      Event.countDocuments(),
      Location.countDocuments(),
    ]);

    // ===== ENROLLMENT TREND (Monthly Applications) =====
    const enrollmentTrendRaw = await Application.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing months (1–12)
    const enrollmentTrend = Array.from({ length: 12 }, (_, i) => {
      const found = enrollmentTrendRaw.find((m) => m._id === i + 1);
      return { month: i + 1, total: found ? found.total : 0 };
    });

    // ===== TRIAL STATUS (Pie Chart) =====
    const trialStatus = await Event.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // ===== JOBS OVERVIEW (Open vs Closed per month) =====
    const jobsOverviewRaw = await Job.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          open: {
            $sum: { $cond: ["$isActive", 1, 0] },
          },
          closed: {
            $sum: { $cond: ["$isActive", 0, 1] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const jobsOverview = Array.from({ length: 12 }, (_, i) => {
      const found = jobsOverviewRaw.find((m) => m._id === i + 1);
      return {
        month: i + 1,
        open: found ? found.open : 0,
        closed: found ? found.closed : 0,
      };
    });

    // ===== APPLICATIONS OVER TIME =====
    const applicationsRaw = await Application.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const applicationsOverTime = Array.from({ length: 12 }, (_, i) => {
      const found = applicationsRaw.find((m) => m._id === i + 1);
      return {
        month: i + 1,
        total: found ? found.total : 0,
      };
    });

    // ===== FINAL RESPONSE =====
    res.status(200).json({
      stats: {
        totalTrials,
        totalPatients,
        openJobs,
        activeSolutions,
        newsAndEvents: newsCount + eventCount,
        locations,
      },
      charts: {
        enrollmentTrend,
        trialStatus,
        jobsOverview,
        applicationsOverTime,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
