const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createApplication,
  getApplications,
  getApplicationById,
  getCVUrl,
  updateStatus,
  deleteApplication,
} = require("../controllers/applicationController");

// PUBLIC
router.post("/", upload.single("cv"), createApplication);

// ADMIN
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.get("/:id/cv", getCVUrl);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteApplication);

module.exports = router;
