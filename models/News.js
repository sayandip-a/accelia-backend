const mongoose = require("mongoose");
const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    tag: { type: String, required: true, trim: true },
    icon: { type: String, default: "📰" },
    bg: { type: String, default: "linear-gradient(135deg,#1B8FA6,#0B1F3A)" },
    imageUrl: { type: String, default: "" },
    date: { type: String, required: true },
    published: { type: Boolean, default: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("News", NewsSchema);
