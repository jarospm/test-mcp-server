import { z } from "zod";
import { getAlerts, getForecast } from "../api/nws-client.js";
import { AlertsResponse } from "../types.js";

/**
 * Formats an alert for display
 */
function formatAlert(alert: AlertsResponse["features"][0]): string {
  const { event, areaDesc, severity, status, headline } = alert.properties;
  return `Event: ${event}
Area: ${areaDesc}
Severity: ${severity}
Status: ${status}
Headline: ${headline}
---`;
}

/**
 * Tool definitions for weather-related operations
 */
export const weatherTools = {
  get_alerts: {
    description: "Get weather alerts for a US state",
    inputSchema: {
      state: z
        .string()
        .length(2)
        .describe("Two-letter state code (e.g. CA, NY)"),
    },
    handler: async ({ state }: { state: string }) => {
      const stateCode = state.toUpperCase();
      const alertsData = await getAlerts(stateCode);

      if (!alertsData) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to retrieve alerts for ${stateCode}. Please check the state code and try again.`,
            },
          ],
        };
      }

      const features = alertsData.features || [];
      if (features.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No active alerts for ${stateCode}.`,
            },
          ],
        };
      }

      const formattedAlerts = features.map(formatAlert).join("\n");
      return {
        content: [
          {
            type: "text" as const,
            text: `Active alerts for ${stateCode}:\n\n${formattedAlerts}`,
          },
        ],
      };
    },
  },

  get_forecast: {
    description: "Get weather forecast for a location",
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
    },
    handler: async ({
      latitude,
      longitude,
    }: {
      latitude: number;
      longitude: number;
    }) => {
      const forecastData = await getForecast(latitude, longitude);

      if (!forecastData) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to retrieve forecast for coordinates ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
            },
          ],
        };
      }

      const periods = forecastData.properties?.periods || [];
      if (periods.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No forecast periods available",
            },
          ],
        };
      }

      const formattedForecast = periods
        .slice(0, 5)
        .map(
          (period) =>
            `${period.name}:
Temperature: ${period.temperature}°${period.temperatureUnit}
Wind: ${period.windSpeed} ${period.windDirection}
${period.shortForecast}
${period.detailedForecast}
---`
        )
        .join("\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast}`,
          },
        ],
      };
    },
  },
};
