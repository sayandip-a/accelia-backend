const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationController");

// PUBLIC
router.get("/", getLocations);

// PROTECTED
router.post("/", auth, createLocation);
router.put("/:id", auth, updateLocation);
router.delete("/:id", auth, deleteLocation);

module.exports = router;
