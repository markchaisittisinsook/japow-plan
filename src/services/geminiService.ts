import { TravelDay, WeatherInfo, OutfitSuggestion } from "../types";

// Get the backend API URL
const getBackendURL = () => {
  return import.meta.env.VITE_API_URL || "https://markujun-service-1005290122840.asia-southeast1.run.app";
};

export async function getEnrichedDayData(day: TravelDay): Promise<{ weather: WeatherInfo; outfit: OutfitSuggestion }> {
  try {
    const backendURL = getBackendURL();
    const fullURL = `${backendURL}/api/gh-pages/travel/enrich-day`;
    
    console.log(`>>> [DEBUG] Fetching from: ${fullURL}`);
    
    const response = await fetch(fullURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: day.title,
        date: day.date,
        description: day.description,
        location: day.location || "Japan", // Default to Japan or something sensible
        destinationContext: day.destinationContext || "destination",
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