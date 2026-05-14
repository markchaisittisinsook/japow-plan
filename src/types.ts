export interface TravelDay {
  date: string;
  title: string;
  description: string;
  activities: string[];
}

export interface TravelPlan {
  title: string;
  overview: string;
  days: TravelDay[];
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
}

export interface OutfitSuggestion {
  top: string;
  bottom: string;
  accessories: string[];
  reason: string;
}
