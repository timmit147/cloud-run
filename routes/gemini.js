const express = require("express");
const router = express.Router();

router.post("/gemini", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({
        reply: "⚠️ Gemini returned no text",
        debug: data,
      });
    }

    res.json({ reply });
  } catch (err) {
    console.error("GEMINI ERROR:", err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
});

module.exports = router;
