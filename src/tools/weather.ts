import { z } from "zod";
import { getCurrentWeather, getForecast } from "../api/open-meteo-client.js";
import {
  OpenMeteoCurrentResponse,
  OpenMeteoForecastResponse,
} from "./types.js";

/**
 * Converts WMO weather code to human-readable description
 *
 * WMO codes reference:
 * 0: Clear sky
 * 1, 2, 3: Mainly clear, partly cloudy, overcast
 * 45, 48: Fog and depositing rime fog
 * 51, 53, 55: Drizzle (light, moderate, dense)
 * 56, 57: Freezing drizzle (light, dense)
 * 61, 63, 65: Rain (slight, moderate, heavy)
 * 66, 67: Freezing rain (light, heavy)
 * 71, 73, 75: Snow fall (slight, moderate, heavy)
 * 77: Snow grains
 * 80, 81, 82: Rain showers (slight, moderate, violent)
 * 85, 86: Snow showers (slight, heavy)
 * 95: Thunderstorm (slight or moderate)
 * 96, 99: Thunderstorm with hail (slight, heavy)
 */
function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code === 51) return "Light drizzle";
  if (code === 53) return "Moderate drizzle";
  if (code === 55) return "Dense drizzle";
  if (code === 56) return "Light freezing drizzle";
  if (code === 57) return "Dense freezing drizzle";
  if (code === 61) return "Slight rain";
  if (code === 63) return "Moderate rain";
  if (code === 65) return "Heavy rain";
  if (code === 66) return "Light freezing rain";
  if (code === 67) return "Heavy freezing rain";
  if (code === 71) return "Slight snow";
  if (code === 73) return "Moderate snow";
  if (code === 75) return "Heavy snow";
  if (code === 77) return "Snow grains";
  if (code === 80) return "Slight rain showers";
  if (code === 81) return "Moderate rain showers";
  if (code === 82) return "Violent rain showers";
  if (code === 85) return "Slight snow showers";
  if (code === 86) return "Heavy snow showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Thunderstorm with hail";
  return `Unknown (code ${code})`;
}

/**
 * Converts wind direction in degrees to compass direction
 */
function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Formats current weather data for display
 */
function formatCurrentWeather(data: OpenMeteoCurrentResponse): string {
  const { current, current_units } = data;
  const condition = getWeatherDescription(current.weather_code);
  const windDir = getWindDirection(current.wind_direction_10m);

  return `Current Weather (${data.latitude}, ${data.longitude}):

🌡️ Temperature: ${current.temperature_2m}${current_units.temperature_2m}
   Feels like: ${current.apparent_temperature}${current_units.apparent_temperature}

☁️ Conditions: ${condition}
   Cloud cover: ${current.cloud_cover}${current_units.cloud_cover}

💧 Precipitation: ${current.precipitation}${current_units.precipitation}
   Humidity: ${current.relative_humidity_2m}${current_units.relative_humidity_2m}

💨 Wind: ${current.wind_speed_10m}${current_units.wind_speed_10m} ${windDir}
   Gusts: ${current.wind_gusts_10m}${current_units.wind_gusts_10m}

🔽 Pressure: ${current.pressure_msl}${current_units.pressure_msl}`;
}

/**
 * Formats forecast data for display
 */
function formatForecast(data: OpenMeteoForecastResponse): string {
  const { daily, daily_units } = data;
  const days = daily.time.length;

  let output = `${days}-Day Forecast (${data.latitude}, ${data.longitude}):\n\n`;

  for (let i = 0; i < days; i++) {
    const date = new Date(daily.time[i]);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    const condition = getWeatherDescription(daily.weather_code[i]);
    const windDir = getWindDirection(daily.wind_direction_10m_dominant[i]);

    output += `📅 ${dayName}
   ${condition}
   🌡️ High: ${daily.temperature_2m_max[i]}${daily_units.temperature_2m_max} | Low: ${daily.temperature_2m_min[i]}${daily_units.temperature_2m_min}
   💧 Precipitation: ${daily.precipitation_sum[i]}${daily_units.precipitation_sum} (${daily.precipitation_probability_max[i]}${daily_units.precipitation_probability_max} chance)
   💨 Wind: ${daily.wind_speed_10m_max[i]}${daily_units.wind_speed_10m_max} ${windDir}
---
`;
  }

  return output;
}

/**
 * Tool definitions for weather-related operations
 */
export const weatherTools = {
  get_current_weather: {
    description: "Get current weather conditions for any location worldwide (by coordinates)",
    inputSchema: {
      latitude: z
        .number()
        .min(-90)
        .max(90)
        .describe("Latitude of the location"),
      longitude: z
        .number()
        .min(-180)
        .max(180)
        .describe("Longitude of the location"),
      temperatureUnit: z
        .enum(["celsius", "fahrenheit"])
        .optional()
        .describe("Temperature unit (default: celsius)"),
    },
    handler: async (args: {
      latitude: number;
      longitude: number;
      temperatureUnit?: "celsius" | "fahrenheit";
    }) => {
      const weatherData = await getCurrentWeather(
        args.latitude,
        args.longitude,
        args.temperatureUnit
      );

      if (!weatherData) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to retrieve weather data for coordinates ${args.latitude}, ${args.longitude}. Please check the coordinates and try again.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: formatCurrentWeather(weatherData),
          },
        ],
      };
    },
  },

  get_forecast: {
    description: "Get weather forecast for any location worldwide (by coordinates)",
    inputSchema: {
      latitude: z
        .number()
        .min(-90)
        .max(90)
        .describe("Latitude of the location"),
      longitude: z
        .number()
        .min(-180)
        .max(180)
        .describe("Longitude of the location"),
      forecastDays: z
        .number()
        .min(1)
        .max(16)
        .optional()
        .describe("Number of forecast days (1-16, default: 7)"),
      temperatureUnit: z
        .enum(["celsius", "fahrenheit"])
        .optional()
        .describe("Temperature unit (default: celsius)"),
    },
    handler: async (args: {
      latitude: number;
      longitude: number;
      forecastDays?: number;
      temperatureUnit?: "celsius" | "fahrenheit";
    }) => {
      const forecastData = await getForecast(
        args.latitude,
        args.longitude,
        args.forecastDays,
        args.temperatureUnit
      );

      if (!forecastData) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to retrieve forecast for coordinates ${args.latitude}, ${args.longitude}. Please check the coordinates and try again.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: formatForecast(forecastData),
          },
        ],
      };
    },
  },
};
