import { GoogleGenAI, Type } from "@google/genai";
import { WeatherInfo, OutfitSuggestion, TravelDay } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEnrichedDayData(day: TravelDay): Promise<{ weather: WeatherInfo; outfit: OutfitSuggestion }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide weather information and outfit suggestions in Thai language for a travel day in ${day.title} on ${day.date}.
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
                condition: { type: Type.STRING, description: "Weather condition in Thai (e.g. แดดจัด, มีเมฆมาก, ฝนตก)" },
                icon: { type: Type.STRING, description: "Lucide icon name (e.g. Sun, Cloud, CloudRain)" },
              },
              required: ["temp", "condition", "icon"],
            },
            outfit: {
              type: Type.OBJECT,
              properties: {
                top: { type: Type.STRING, description: "Top clothing in Thai" },
                bottom: { type: Type.STRING, description: "Bottom clothing in Thai" },
                accessories: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Accessories in Thai" },
                reason: { type: Type.STRING, description: "Reason for the suggestion in Thai" },
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
    // Fallback data in Thai
    return {
      weather: { temp: 20, condition: "แดดจัด", icon: "Sun" },
      outfit: { top: "เสื้อแจ็คเก็ตแบบบาง", bottom: "กางเกงยีนส์ที่ใส่สบาย", accessories: ["แว่นกันแดด"], reason: "ชุดเดินทางทั่วไปที่เน้นความคล่องตัวและสบายตัว" }
    };
  }
}
