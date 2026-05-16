import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/gh-pages/travel/enrich-day", async (req, res) => {
    const { title, date, description, activities } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server." });
    }

    try {
      const prompt = `Provide weather information and outfit suggestions in Thai language for a travel day in ${title} on ${date}.
      Activities: ${activities?.join(", ") || "none"}
      Plan details: ${description}
      
      Return as JSON with this structure:
      {
        "weather": { "temp": number, "condition": string, "icon": string },
        "outfit": { "top": string, "bottom": string, "accessories": string[], "reason": string }
      }
      
      Thai weather condition examples: แดดจัด, มีเมฆมาก, ฝนตก, หิมะตก
      Lucide icon name examples: Sun, Cloud, CloudRain, Snowflake`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to enrich travel day data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
