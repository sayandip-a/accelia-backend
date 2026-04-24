require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ email: "admin@accelia.in" });
  if (existing) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  await Admin.create({
    name: "Super Admin",
    email: "admin@accelia.in",
    password: "sayandip",
    role: "superadmin",
    isActive: true,
  });

  console.log("✅ Admin created successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
