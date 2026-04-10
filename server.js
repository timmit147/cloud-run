const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const routesPath = path.join(__dirname, "routes");

// auto-load every file in routes folder
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(`./routes/${file}`);
    app.use("/", route);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server running on", port);
});
