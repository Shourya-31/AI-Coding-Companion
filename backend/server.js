import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint that your extension will call
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // 🧠 Log Gemini API raw response for debugging
    console.log("🔍 Gemini API response:", JSON.stringify(data, null, 2));

    const output =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model";

    res.json({ output });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
