const express = require("express");
const router = express.Router();

/**
 * Helper: safe async wrapper
 * voorkomt dat errors je server slopen
 */
const safe = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * POST /contact
 * voorbeeld contact endpoint
 */
router.post(
  "/contact",
  safe(async (req, res) => {
    const { name, email, message } = req.body;

    // 🛡️ basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: "name, email and message are required"
      });
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({
        ok: false,
        error: "invalid email"
      });
    }

    // 🧠 hier zou je normaal doen:
    // - email versturen (Nodemailer / Gmail API)
    // - opslaan in DB
    // - webhook sturen

    console.log("📩 New contact message:", {
      name,
      email,
      message
    });

    return res.json({
      ok: true,
      message: "Message received successfully"
    });
  })
);

/**
 * GET /contact (test route)
 */
router.get("/contact", (req, res) => {
  res.json({
    ok: true,
    message: "contact route is working"
  });
});

module.exports = router;
