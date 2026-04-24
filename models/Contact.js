const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    country: { type: String, default: "" },
    service: { type: String, default: "" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Contact", ContactSchema);
