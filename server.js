const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// Basic middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "running"
  });
});

// Optional extra health endpoint
app.get("/ping", (req, res) => {
  res.json({
    ok: true,
    message: "pong"
  });
});

// Safe dynamic route loader
const routesPath = path.join(__dirname, "routes");

if (fs.existsSync(routesPath)) {
  const files = fs.readdirSync(routesPath);

  files.forEach((file) => {
    if (!file.endsWith(".js")) return;

    try {
      console.log(`Loading route: ${file}`);

      const route = require(`./routes/${file}`);

      if (!route || typeof route !== "function") {
        console.log(`Skipping ${file}: invalid router export`);
        return;
      }

      app.use("/", route);
    } catch (err) {
      console.error(`Failed to load route ${file}:`, err.message);
    }
  });
} else {
  console.log("routes folder not found");
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    ok: false,
    error: "Internal server error"
  });
});

// Cloud Run port binding
const port = process.env.PORT || 8080;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
