const Expertise = require("../models/Expertise");

// GET ALL
exports.getExpertise = async (req, res) => {
  try {
    const filter = req.query.admin ? {} : { isActive: true };

    const data = await Expertise.find(filter).sort({ order: 1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createExpertise = async (req, res) => {
  try {
    const data = await Expertise.create(req.body);

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.updateExpertise = async (req, res) => {
  try {
    const data = await Expertise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteExpertise = async (req, res) => {
  try {
    await Expertise.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
