const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

/**
 * 🔒 RATE LIMIT (only for this route)
 */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    error: "Too many requests, slow down"
  }
});

/**
 * 🤖 GEMINI API
 */
router.post("/gemini", limiter, async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "No message provided"
      });
    }

    // ⏱️ TIMEOUT (5 seconds)
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 5000);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    clearTimeout(timeout);

    const data = await response.json();

    console.log("GEMINI RAW:", JSON.stringify(data, null, 2));

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.json({
        reply: "⚠️ Gemini returned no text",
        debug: data
      });
    }

    res.json({ reply });

  } catch (err) {
    if (err.name === "AbortError") {
      return res.status(504).json({
        error: "Request timeout (Gemini too slow)"
      });
    }

    console.error("ERROR:", err);

    res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
});

module.exports = router;
