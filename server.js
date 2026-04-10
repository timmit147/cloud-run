const express = require("express");
const app = express();

/**
 * 1. JOUW EIGEN API (zonder GPT)
 */
app.get("/hallo", (req, res) => {
  res.json({
    type: "custom-api",
    message: "hallo hallo 👋"
  });
});

/**
 * 2. GPT API (server-side call)
 * Op homepage
 */
app.get("/", async (req, res) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "hallo" }
      ]
    })
  });

  const data = await response.json();
  const answer = data.choices[0].message.content;

  res.send(`
    <h2>🤖 GPT RESPONSE</h2>
    <p>${answer}</p>
  `);
});

const port = process.env.PORT || 8080;
app.listen(port);
