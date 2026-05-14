import { GoogleGenAI, Type } from "@google/genai";
import { WeatherInfo, OutfitSuggestion, TravelDay } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEnrichedDayData(day: TravelDay): Promise<{ weather: WeatherInfo; outfit: OutfitSuggestion }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide weather information and outfit suggestions for a travel day in ${day.title} on ${day.date}.
      Activities: ${day.activities.join(", ")}
      Plan details: ${day.description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weather: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.NUMBER, description: "Temperature in Celsius" },
                condition: { type: Type.STRING, description: "Weather condition (e.g. Sunny, Cloudy, Rain)" },
                icon: { type: Type.STRING, description: "Lucide icon name (e.g. Sun, Cloud, CloudRain)" },
              },
              required: ["temp", "condition", "icon"],
            },
            outfit: {
              type: Type.OBJECT,
              properties: {
                top: { type: Type.STRING },
                bottom: { type: Type.STRING },
                accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
                reason: { type: Type.STRING },
              },
              required: ["top", "bottom", "accessories", "reason"],
            },
          },
          required: ["weather", "outfit"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error) {
    console.error("Error fetching Gemini data:", error);
    // Fallback data
    return {
      weather: { temp: 20, condition: "Sunny", icon: "Sun" },
      outfit: { top: "Light jacket", bottom: "Comfortable jeans", accessories: ["Sunglasses"], reason: "General comfortable travel wear." }
    };
  }
}
