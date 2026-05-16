import { TravelDay, WeatherInfo, OutfitSuggestion } from "../types";

// Get the backend API URL (configured via env or default)
const getBackendURL = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:8080";
};

export async function getEnrichedDayData(day: TravelDay): Promise<{ weather: WeatherInfo; outfit: OutfitSuggestion }> {
  try {
    const backendURL = getBackendURL();
    const response = await fetch(`${backendURL}/api/gh-pages/travel/enrich-day`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: day.title,
        date: day.date,
        description: day.description,
        activities: day.activities,
      }),
    });

    if (!response.ok) {
      console.error(`Backend error: ${response.status} ${response.statusText}`);
      return getFallbackData();
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching from backend:", error);
    return getFallbackData();
  }
}

function getFallbackData(): { weather: WeatherInfo; outfit: OutfitSuggestion } {
  return {
    weather: { temp: 99, condition: "N/A", icon: "Sun" },
    outfit: {
      top: "Top N/A",
      bottom: "Bottom N/A",
      accessories: ["N/A"],
      reason: "Reason N/A",
    },
  };
}