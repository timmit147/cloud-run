const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 🔍 Validatie
    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: "Naam, email en bericht zijn verplicht"
      });
    }

    // 🔐 Check env vars
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        ok: false,
        error: "Server mist email configuratie (EMAIL_USER / EMAIL_PASS)"
      });
    }

    // 📩 Transporter (Outlook / Hotmail)
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // ✉️ Mail versturen
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || "Nieuw bericht via website",
      text: `
Naam: ${name}
Email: ${email}

Bericht:
${message}
      `
    });

    // ✅ Success
    return res.json({
      ok: true,
      message: "Mail succesvol verstuurd"
    });

  } catch (err) {
    console.error("❌ MAIL ERROR:", err);

    // 🔥 duidelijke error terug naar frontend
    return res.status(500).json({
      ok: false,
      error: err.message || "Mail verzenden mislukt"
    });
  }
});

module.exports = router;
