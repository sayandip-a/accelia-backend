const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getExpertise,
  createExpertise,
  updateExpertise,
  deleteExpertise,
} = require("../controllers/expertiseController");

// PUBLIC
router.get("/", getExpertise);

// PROTECTED
router.post("/", auth, createExpertise);
router.put("/:id", auth, updateExpertise);
router.delete("/:id", auth, deleteExpertise);

module.exports = router;
