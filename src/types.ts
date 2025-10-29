import { z } from "zod";

// Zod schemas for tool inputs
export const GetAlertsArgsSchema = z.object({
  state: z
    .string()
    .length(2)
    .describe("Two-letter state code (e.g. CA, NY)"),
});

export const GetForecastArgsSchema = z.object({
  latitude: z.number().min(-90).max(90).describe("Latitude coordinate"),
  longitude: z.number().min(-180).max(180).describe("Longitude coordinate"),
});

// Type exports derived from schemas
export type GetAlertsArgs = z.infer<typeof GetAlertsArgsSchema>;
export type GetForecastArgs = z.infer<typeof GetForecastArgsSchema>;

// NWS API response types
export interface AlertsResponse {
  features: Array<{
    properties: {
      event: string;
      areaDesc: string;
      severity: string;
      status: string;
      headline: string;
    };
  }>;
}

export interface PointsResponse {
  properties: {
    forecast: string;
  };
}

export interface ForecastResponse {
  properties: {
    periods: Array<{
      name: string;
      temperature: number;
      temperatureUnit: string;
      windSpeed: string;
      windDirection: string;
      shortForecast: string;
      detailedForecast: string;
    }>;
  };
}
