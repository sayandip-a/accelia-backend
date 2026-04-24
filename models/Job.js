const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    dept: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    experience: { type: String, default: "" },
    salary: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    applications: { type: Number, default: 0 },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    deadline: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", JobSchema);
