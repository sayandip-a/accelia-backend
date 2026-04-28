const Contact = require("../models/Contact");

// PUBLIC: Submit Inquiry
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      message: "Inquiry submitted",
      id: contact._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ADMIN: Get all contacts
exports.getContacts = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const filter = status ? { status } : {};

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      contacts,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: Update status / notes
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ADMIN: Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
