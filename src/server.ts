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
    "get_alerts",
    weatherTools.get_alerts.description,
    weatherTools.get_alerts.inputSchema,
    weatherTools.get_alerts.handler
  );

  server.tool(
    "get_forecast",
    weatherTools.get_forecast.description,
    weatherTools.get_forecast.inputSchema,
    weatherTools.get_forecast.handler
  );

  return server;
}
