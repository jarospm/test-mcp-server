import { AlertsResponse, PointsResponse, ForecastResponse } from "../types.js";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

/**
 * Makes a request to the NWS API with proper headers
 */
async function makeNWSRequest<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/geo+json",
      },
    });

    if (!response.ok) {
      console.error(`NWS API error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch from NWS API:", error);
    return null;
  }
}

/**
 * Fetches active weather alerts for a given state
 */
export async function getAlerts(stateCode: string): Promise<AlertsResponse | null> {
  const url = `${NWS_API_BASE}/alerts/active?area=${stateCode}`;
  return makeNWSRequest<AlertsResponse>(url);
}

/**
 * Fetches forecast for given coordinates
 * This is a two-step process: first get the forecast URL from points endpoint,
 * then fetch the actual forecast data
 */
export async function getForecast(
  latitude: number,
  longitude: number
): Promise<ForecastResponse | null> {
  // Step 1: Get the forecast URL for this location
  const pointsUrl = `${NWS_API_BASE}/points/${latitude},${longitude}`;
  const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

  if (!pointsData) {
    return null;
  }

  // Step 2: Fetch the actual forecast
  const forecastUrl = pointsData.properties.forecast;
  return makeNWSRequest<ForecastResponse>(forecastUrl);
}
