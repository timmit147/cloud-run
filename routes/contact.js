const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const safe = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 📨 mail transporter (Gmail voorbeeld)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post(
  "/contact",
  safe(async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: "Missing fields"
      });
    }

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // jij ontvangt het
      subject: `Nieuw bericht van ${name}`,
      text: `
Naam: ${name}
Email: ${email}

Bericht:
${message}
      `
    });

    return res.json({
      ok: true,
      message: "Email successfully sent"
    });
  })
);

module.exports = router;
