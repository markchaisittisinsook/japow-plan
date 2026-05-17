import { TravelPlan, TravelDay } from "../types";

export function parseTravelPlan(markdown: string): TravelPlan {
  const lines = markdown.split("\n");
  const plan: TravelPlan = {
    title: "",
    overview: "",
    days: [],
  };

  let currentDay: TravelDay | null = null;
  let inOverview = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    // Parse main title
    if (line.startsWith("# ") && !plan.title) {
      plan.title = line.replace("# ", "");
      continue;
    }

    // Parse Day sections: ## YYYY-MM-DD: Title
    const dayMatch = line.match(/^## (\d{4}-\d{2}-\d{2}): (.*)/);
    if (dayMatch) {
      inOverview = false;
      if (currentDay) {
        plan.days.push(currentDay);
      }
      currentDay = {
        date: dayMatch[1],
        title: dayMatch[2],
        description: "",
        activities: [],
      };
      continue;
    }

    if (inOverview) {
      plan.overview += (plan.overview ? "\n" : "") + line;
    } else if (currentDay) {
      if (line.startsWith("- ")) {
        currentDay.activities.push(line.replace("- ", ""));
      } else if (line.startsWith("Location: ")) {
        currentDay.location = line.replace("Location: ", "");
      } else if (line.startsWith("Context: ")) {
        currentDay.destinationContext = line.replace("Context: ", "");
      } else {
        currentDay.description += (currentDay.description ? "\n" : "") + line;
      }
    }
  }

  if (currentDay) {
    plan.days.push(currentDay);
  }

  return plan;
}
