const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "server is running"
  });
});

// Load routes dynamically
const routesPath = path.join(__dirname, "routes");

if (fs.existsSync(routesPath)) {
  fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith(".js")) {
      const route = require(`./routes/${file}`);
      app.use("/", route);
    }
  });
} else {
  console.log("routes folder not found");
}

// Cloud Run port
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server running on port", port);
});
