const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// PUBLIC
router.post("/", createContact);

// ADMIN
router.get("/", auth, getContacts);
router.put("/:id", auth, updateContact);
router.delete("/:id", auth, deleteContact);

module.exports = router;
