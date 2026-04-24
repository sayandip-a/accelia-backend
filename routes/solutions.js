const express = require("express");
const Solution = require("../models/Solution");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filter = req.query.admin ? {} : { isActive: true };
    const solutions = await Solution.find(filter).sort({ order: 1 });
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/", auth, async (req, res) => {
  try {
    res.status(201).json(await Solution.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put("/:id", auth, async (req, res) => {
  try {
    res.json(
      await Solution.findByIdAndUpdate(req.params.id, req.body, { new: true }),
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    await Solution.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
