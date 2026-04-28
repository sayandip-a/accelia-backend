const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174", // add this
  "https://accelia-three.vercel.app",
  "https://accelia-p2t21y85y-sayandips-projects-45a27bd7.vercel.app",
  /\.vercel\.app$/,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowed = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin,
      );

      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/news", require("./routes/news"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/solutions", require("./routes/solutions"));
app.use("/api/expertise", require("./routes/expertise"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/events", require("./routes/events"));
app.use("/api/locations", require("./routes/locations"));
app.use("/api/team", require("./routes/team"));
app.get("/", (req, res) => {
  res.send("🚀 Accelia Backend Running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Accelia Backend Running",
    timestamp: new Date(),
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });
