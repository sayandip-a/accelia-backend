const mongoose = require("mongoose");
const ExpertiseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, default: "🔬" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Expertise", ExpertiseSchema);
