import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { weatherTools } from "./tools/weather.js";

/**
 * Creates and configures the MCP server with all tools
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "weather-server",
    version: "1.0.0",
  });

  // Register weather tools
  server.tool(
    "get_current_weather",
    weatherTools.get_current_weather.description,
    weatherTools.get_current_weather.inputSchema,
    weatherTools.get_current_weather.handler
  );

  server.tool(
    "get_forecast",
    weatherTools.get_forecast.description,
    weatherTools.get_forecast.inputSchema,
    weatherTools.get_forecast.handler
  );

  return server;
}
