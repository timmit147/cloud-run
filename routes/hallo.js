const express = require("express");
const router = express.Router();

router.get("/hallo", (req, res) => {
  res.json({ message: "hallo 👋" });
});

module.exports = router;
