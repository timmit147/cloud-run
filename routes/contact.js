const express = require("express");
const router = express.Router();
const sendMail = require("../contact");

// Debug: check of de route bereikbaar is
router.get("/contact", (req, res) => {
  res.json({
    ok: true,
    route: "/contact",
    method: "GET",
    message: "Contact route is alive"
  });
});

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        ok: false,
        error: "Missing fields",
        received: { name, email, subject, message }
      });
    }

    await sendMail(name, email, subject, message);

    return res.status(200).json({
      ok: true,
      message: "Email sent successfully"
    });
  } catch (err) {
    console.error("CONTACT ROUTE ERROR:", err);

    return res.status(500).json({
      ok: false,
      error: "Email failed",
      details: err.message
    });
  }
});

module.exports = router;
