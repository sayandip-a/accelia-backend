const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const {
  createApplication,
  getApplications,
  getApplicationById,
  getCVUrl,
  updateStatus,
  deleteApplication,
} = require("../controllers/applicationController");

// ── PUBLIC ────────────────────────────────────────────────────────────────────
router.post("/", upload.single("cv"), createApplication);

// ── ADMIN (protected) ─────────────────────────────────────────────────────────
router.get("/", auth, getApplications);
router.get("/:id", auth, getApplicationById);
router.get("/:id/cv", auth, getCVUrl);
router.patch("/:id/status", auth, updateStatus);
router.delete("/:id", auth, deleteApplication);

module.exports = router;
