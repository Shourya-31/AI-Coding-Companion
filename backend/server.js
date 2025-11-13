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
    // ✅ Use the correct Gemini generate endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5:generate?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: { 
            text: prompt 
          },
          temperature: 0.7, // Optional: controls creativity
          maxOutputTokens: 500 // Optional: controls length
        })
      }
    );

    const data = await response.json();

    // 🧠 Log Gemini API raw response for debugging
    console.log("🔍 Gemini API response:", JSON.stringify(data, null, 2));

    // ✅ Extract output safely
    const output =
      data.candidates?.[0]?.content?.[0]?.text ||
      "No response from model";

    res.json({ output });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));