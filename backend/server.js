// import express from "express";
// import dotenv from "dotenv";
// import fetch from "node-fetch";
// import cors from "cors";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// // CLOUÐ GEMINI ENDPOINT (Vertex AI)
// const MODEL = "gemini-1.5-flash";
// const LOCATION = "us-central1";
// const PROJECT = "916327308324"; // your project number

// app.post("/api/generate", async (req, res) => {
//   const { prompt } = req.body;

//   try {
//     const response = await fetch(
//       `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${process.env.GEMINI_API_KEY}` // Cloud Gemini uses Bearer
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               role: "user",
//               parts: [{ text: prompt }]
//             }
//           ],
//           generationConfig: {
//             temperature: 0.7,
//             maxOutputTokens: 512
//           }
//         })
//       }
//     );

//     const raw = await response.text();
//     console.log("🔍 Raw Gemini response:", raw);

//     let data;
//     try {
//       data = JSON.parse(raw);
//     } catch {
//       return res.status(500).json({
//         error: "Invalid JSON from Gemini",
//         raw
//       });
//     }

//     const output =
//       data.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No response from model";

//     res.json({ output });
//   } catch (err) {
//     console.error("❌ Server error:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));






import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();



const app = express();
app.use(express.json());
app.use(cors());

// correct model
const MODEL = "gemini-2.0-flash";

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log("➡️ Requesting:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const raw = await response.text();
    console.log("🔍 Raw Gemini response:", raw);

    // parse JSON
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.json({ output: "Invalid JSON from API", raw });
    }

    // extract response
    const output =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model";

    return res.json({ output });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));