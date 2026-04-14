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

async function sendMail(name, email, subject, message) {
  if (!name || !email || !subject || !message) {
    throw new Error("Missing fields");
  }

  return transporter.sendMail({
    from: `"Tim Meeuwsen Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `Contactformulier: ${subject}`,
    text: `Naam: ${name}\nEmail: ${email}\nOnderwerp: ${subject}\n\nBericht:\n${message}`,
    html: `
      <h2>Nieuw bericht via contactformulier</h2>
      <p><strong>Naam:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Onderwerp:</strong> ${subject}</p>
      <p><strong>Bericht:</strong><br>${message.replace(/\n/g, "<br>")}</p>
    `,
  });
}

module.exports = sendMail;
