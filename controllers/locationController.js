const Location = require("../models/Location");

// GET ALL
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ order: 1 });
    res.status(200).json({ locations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json({ location });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ location });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
