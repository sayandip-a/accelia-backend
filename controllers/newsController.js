const News = require("../models/News");

// GET ALL (with pagination)
exports.getNews = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const filter = req.query.admin ? {} : { published: true };

    const news = await News.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate("author", "name");

    const total = await News.countDocuments(filter);

    res.json({
      news,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE + INCREMENT VIEWS
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("author", "name");

    if (!news) {
      return res.status(404).json({ message: "Not found" });
    }

    // increment views
    await News.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createNews = async (req, res) => {
  try {
    const news = await News.create({
      ...req.body,
      author: req.admin._id,
    });

    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!news) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(news);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
