const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "timmeeuwsen.dev@gmail.com",
    pass: "JOUW_APP_PASSWORD_HIER" // zonder spaties
  }
});

async function sendMail(name, email, message) {
  return transporter.sendMail({
    from: `"Website Contact" <timmeeuwsen.dev@gmail.com>`,
    to: "timmeeuwsen.dev@gmail.com",
    replyTo: email,
    subject: `Nieuw bericht van ${name}`,
    text: `
Naam: ${name}
Email: ${email}

Bericht:
${message}
    `
  });
}

module.exports = sendMail;
