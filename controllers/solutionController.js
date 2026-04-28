const Solution = require("../models/Solution");

// GET ALL
exports.getSolutions = async (req, res) => {
  try {
    const filter = req.query.admin ? {} : { isActive: true };

    const solutions = await Solution.find(filter).sort({ order: 1 });

    res.json(solutions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createSolution = async (req, res) => {
  try {
    const solution = await Solution.create(req.body);

    res.status(201).json(solution);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.updateSolution = async (req, res) => {
  try {
    const solution = await Solution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!solution) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(solution);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteSolution = async (req, res) => {
  try {
    const solution = await Solution.findByIdAndDelete(req.params.id);

    if (!solution) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
