/**
 * Prompt definitions for weather-based clothing recommendations
 */

import { getCurrentWeather } from "../api/open-meteo-client.js";
import { formatClothingAsMarkdown } from "../resources/clothing.js";
import { PromptDefinition, WhatToWearArgsSchema } from "./types.js";

/**
 * What to wear prompt exports
 */
export const whatToWearPrompts: Record<string, PromptDefinition> = {
  "what-to-wear": {
    description: "Get personalized clothing recommendations based on current weather conditions at a location",
    argsSchema: WhatToWearArgsSchema,
    handler: async ({ latitude, longitude, condition }) => {
      // Parse and validate coordinates
      const lat = parseFloat(latitude || "0");
      const lon = parseFloat(longitude || "0");

      // Fetch current weather for the location
      const weatherData = await getCurrentWeather(lat, lon, "celsius");

      let weatherInfo = "";
      if (weatherData) {
        weatherInfo = `Current weather at coordinates (${lat}, ${lon}):
- Temperature: ${weatherData.current.temperature_2m}°C
- Wind Speed: ${weatherData.current.wind_speed_10m} km/h
- Weather Code: ${weatherData.current.weather_code}
`;
      } else {
        weatherInfo = `Weather data unavailable for coordinates (${lat}, ${lon}).`;
      }

      const cond = condition || "mild";
      const resourceUri = `weather://clothing/${cond}`;
      const clothingContent = formatClothingAsMarkdown(cond);

      return {
        title: `What to Wear - ${cond.charAt(0).toUpperCase() + cond.slice(1)} Weather`,
        description: `Clothing recommendations for ${cond} conditions`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Help me decide what to wear today based on the current weather and the ${cond} weather clothing guidelines I've attached.

${weatherInfo}

Please provide:
1. A summary of the current weather conditions and how they match the "${cond}" category
2. Specific clothing recommendations from the guidelines that are most relevant
3. Any additional tips for comfort and safety based on the actual weather data
4. Items I should definitely bring (umbrella, sunglasses, etc.)

Be practical and consider both comfort and weather protection.`,
            },
          },
          {
            role: "user",
            content: {
              type: "resource",
              resource: {
                uri: resourceUri,
                mimeType: "text/markdown",
                text: clothingContent,
              },
            },
          },
        ],
      };
    },
  },
};
