const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// ✅ IMPORTANT for browser frontend (GitHub Pages)
app.use(cors());
app.use(express.json());

// 🧠 Health check route (always test this first)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "server is running"
  });
});

const routesPath = path.join(__dirname, "routes");

// 🧠 Safety check: folder exists
if (fs.existsSync(routesPath)) {
  fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith(".js")) {
      console.log("Loading route:", file);

      const route = require(`./routes/${file}`);
      app.use("/", route);
    }
  });
} else {
  console.log("⚠️ routes folder not found");
}

// 🚀 Cloud Run port
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server running on port", port);
});
