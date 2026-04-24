const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    registrationLink: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", EventSchema);
