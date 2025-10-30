/**
 * Prompt definitions for weather-based clothing recommendations
 */

import { completable } from "@modelcontextprotocol/sdk/server/completable.js";
import { z } from "zod";
import { getCurrentWeather } from "../api/open-meteo-client.js";
import {
  CONDITIONS,
  formatClothingAsMarkdown,
} from "../resources/clothing.js";

/**
 * Prompt definition structure matching the tools pattern
 */
interface PromptDefinition {
  metadata: {
    title: string;
    description: string;
    argsSchema: Record<string, any>;
  };
  handler: (args: Record<string, string>) => Promise<{
    title: string;
    description: string;
    messages: Array<{
      role: string;
      content: {
        type: string;
        text?: string;
        resource?: {
          uri: string;
          mimeType: string;
          text: string;
        };
      };
    }>;
  }>;
}

/**
 * What to wear prompt exports
 */
export const whatToWearPrompts: Record<string, PromptDefinition> = {
  "what-to-wear": {
    metadata: {
      title: "What to Wear Today",
      description:
        "Get personalized clothing recommendations based on current weather conditions at a location",
      argsSchema: {
        latitude: z.string().describe("Latitude coordinate (-90 to 90)"),
        longitude: z.string().describe("Longitude coordinate (-180 to 180)"),
        condition: completable(z.string(), (value) => {
          return CONDITIONS.filter((cond) =>
            cond.toLowerCase().startsWith(value.toLowerCase())
          ) as any;
        }).describe(
          "Weather condition type: hot, cold, mild, rainy, snowy, or windy"
        ),
      },
    },
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
