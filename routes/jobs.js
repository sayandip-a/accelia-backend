const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
} = require("../controllers/jobController");

// PUBLIC
router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/:id/apply", applyJob);

// ADMIN (protected)
router.post("/", auth, createJob);
router.put("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

module.exports = router;
