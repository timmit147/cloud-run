const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());

// CORS (veilig)
app.use(cors({
  origin: "*", // later kun je dit beperken naar je domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// AUTO LOAD ROUTES (MAG JE NOOIT MEER AANRAKEN)
const routesPath = path.join(__dirname, "routes");

fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(`./routes/${file}`);
    app.use("/", route);
  }
});

// Cloud Run port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server running on", port));
