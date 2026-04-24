// routes/contacts.js
const express = require("express");
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");
const router = express.Router();

// Public: submit inquiry
router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ message: "Inquiry submitted", id: contact._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: get all
router.get("/", auth, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const filter = status ? { status } : {};
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Contact.countDocuments(filter);
    res.json({ contacts, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update status / notes
router.put("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
