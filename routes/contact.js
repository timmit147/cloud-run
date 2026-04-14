const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

/**
 * 🧠 SAFE WRAPPER
 * voorkomt crash van server
 */
const safe = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    console.error("🔥 SAFE WRAPPER ERROR:", err);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
      debug: err.message
    });
  }
};

/**
 * 🔍 DEBUG: check env vars on load
 */
console.log("📦 CONTACT ROUTE LOADED");
console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

/**
 * 📧 TRANSPORTER SETUP
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * 🔍 VERIFY SMTP CONNECTION (runs once on startup)
 */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP VERIFY FAILED:", error);
  } else {
    console.log("✅ SMTP READY - Gmail connection working");
  }
});

/**
 * 📩 CONTACT ROUTE
 */
router.post(
  "/contact",
  safe(async (req, res) => {
    console.log("🚀 STEP 1: Request received");

    const { name, email, message } = req.body;

    console.log("📨 STEP 2: Body parsed:", req.body);

    // validation
    if (!name || !email || !message) {
      console.log("❌ STEP 3: Validation failed");
      return res.status(400).json({
        ok: false,
        error: "Missing fields"
      });
    }

    console.log("✅ STEP 3: Validation passed");

    // email content
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 Nieuw bericht van ${name}`,
      text: `
🚀 NIEUW CONTACT FORM

Naam: ${name}
Email: ${email}

Bericht:
${message}
      `
    };

    console.log("📤 STEP 4: Sending email...");
    console.log("MAIL OPTIONS:", mailOptions);

    // send mail
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ STEP 5: Email sent!");
    console.log("INFO:", info);

    return res.json({
      ok: true,
      message: "Email sent successfully",
      messageId: info.messageId
    });
  })
);

/**
 * 🧪 TEST ROUTE (super belangrijk voor debugging)
 */
router.get("/contact-test", async (req, res) => {
  console.log("🧪 TEST ROUTE HIT");

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "🧪 Test email",
      text: "If you see this, email works!"
    });

    console.log("✅ TEST EMAIL SENT:", info.messageId);

    res.json({
      ok: true,
      message: "Test email sent",
      messageId: info.messageId
    });
  } catch (err) {
    console.error("❌ TEST EMAIL FAILED:", err);

    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

module.exports = router;
