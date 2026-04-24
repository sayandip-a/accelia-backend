const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["superadmin", "editor"], default: "editor" },
    avatar: { type: String, default: "" },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

AdminSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
