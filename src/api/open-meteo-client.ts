/**
 * Open-Meteo API Client
 *
 * Provides functions to fetch weather data from the Open-Meteo API.
 * https://open-meteo.com/en/docs
 */

import {
  OpenMeteoCurrentResponse,
  OpenMeteoForecastResponse,
} from "../tools/types.js";

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Generic helper to make requests to the Open-Meteo API
 */
async function makeOpenMeteoRequest<T>(
  url: string
): Promise<T | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        `Open-Meteo API error: ${response.status} ${response.statusText}`,
        errorData
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Open-Meteo API request failed:", error);
    return null;
  }
}

/**
 * Get current weather conditions for a location
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param temperatureUnit - Temperature unit (celsius or fahrenheit)
 * @returns Current weather data or null on error
 */
export async function getCurrentWeather(
  latitude: number,
  longitude: number,
  temperatureUnit: "celsius" | "fahrenheit" = "celsius"
): Promise<OpenMeteoCurrentResponse | null> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "rain",
      "showers",
      "snowfall",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
    ].join(","),
    temperature_unit: temperatureUnit,
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });

  const url = `${OPEN_METEO_BASE_URL}?${params.toString()}`;
  return makeOpenMeteoRequest<OpenMeteoCurrentResponse>(url);
}

/**
 * Get weather forecast for a location
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param forecastDays - Number of forecast days (1-16)
 * @param temperatureUnit - Temperature unit (celsius or fahrenheit)
 * @returns Forecast data or null on error
 */
export async function getForecast(
  latitude: number,
  longitude: number,
  forecastDays: number = 7,
  temperatureUnit: "celsius" | "fahrenheit" = "celsius"
): Promise<OpenMeteoForecastResponse | null> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "precipitation_sum",
      "rain_sum",
      "showers_sum",
      "snowfall_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "wind_direction_10m_dominant",
    ].join(","),
    forecast_days: forecastDays.toString(),
    temperature_unit: temperatureUnit,
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });

  const url = `${OPEN_METEO_BASE_URL}?${params.toString()}`;
  return makeOpenMeteoRequest<OpenMeteoForecastResponse>(url);
}
