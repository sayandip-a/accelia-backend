const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    state: { type: String, required: true },
    tagline: String,
    isHQ: { type: Boolean, default: false },
    status: { type: String, default: "Active" },
    icon: { type: String, default: "pin" },
    address: String,
    phone: String,
    email: String,
    image: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Location", LocationSchema);
