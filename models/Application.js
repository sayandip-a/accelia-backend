// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobTitle: { type: String, required: true },
    department: { type: String },
    location: { type: String },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },

    // CV stored as base64 string + metadata (no S3/disk needed)
    cv: {
      filename: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      data: { type: String }, // base64
    },

    status: {
      type: String,
      enum: ["new", "reviewing", "shortlisted", "rejected"],
      default: "new",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
