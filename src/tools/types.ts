/**
 * Type definitions and Zod schemas for weather tools
 */

import { z } from "zod";

// Zod schemas for tool inputs
export const GetCurrentWeatherArgsSchema = z.object({
  latitude: z.number().min(-90).max(90).describe("Latitude coordinate"),
  longitude: z.number().min(-180).max(180).describe("Longitude coordinate"),
  temperatureUnit: z
    .enum(["celsius", "fahrenheit"])
    .optional()
    .describe("Temperature unit (default: celsius)"),
});

export const GetForecastArgsSchema = z.object({
  latitude: z.number().min(-90).max(90).describe("Latitude coordinate"),
  longitude: z.number().min(-180).max(180).describe("Longitude coordinate"),
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
});

// Type exports derived from schemas
export type GetCurrentWeatherArgs = z.infer<typeof GetCurrentWeatherArgsSchema>;
export type GetForecastArgs = z.infer<typeof GetForecastArgsSchema>;

// Open-Meteo API response types
export interface OpenMeteoCurrentResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    rain: string;
    showers: string;
    snowfall: string;
    weather_code: string;
    cloud_cover: string;
    pressure_msl: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    wind_gusts_10m: string;
  };
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    apparent_temperature_max: string;
    apparent_temperature_min: string;
    precipitation_sum: string;
    rain_sum: string;
    showers_sum: string;
    snowfall_sum: string;
    precipitation_probability_max: string;
    wind_speed_10m_max: string;
    wind_gusts_10m_max: string;
    wind_direction_10m_dominant: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    precipitation_sum: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}
