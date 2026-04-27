const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true, // 🔥 THIS WAS YOUR MAIN ERROR SOURCE
    },

    category: {
      type: String,
      default: "General",
    },

    tag: {
      type: String,
      default: "News",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    published: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("News", NewsSchema);
