const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://accelia-three.vercel.app",
  /\.vercel\.app$/,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowed = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin,
      );

      if (allowed) return callback(null, true);

      callback(new Error("Not allowed by CORS"));
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
app.use("/api/applications", require("./routes/applications"));
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
app.use(errorHandler);

module.exports = app;
