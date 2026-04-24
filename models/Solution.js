const mongoose = require("mongoose");
const SolutionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true },
    icon: { type: String, default: "🔬" },
    imageUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Solution", SolutionSchema);
