const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendMail(name, email, message) {
  return transporter.sendMail({
    from: `"Website Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `Nieuw bericht van ${name}`,
    text: `Naam: ${name}\nEmail: ${email}\n\nBericht:\n${message}`,
  });
}

module.exports = sendMail;
