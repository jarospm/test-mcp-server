import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { weatherTools } from "./tools/weather.js";
import { clothingResources } from "./resources/clothing-resources.js";
import { whatToWearPrompts } from "./prompts/what-to-wear.js";

/**
 * Creates and configures the MCP server with all tools, resources, and prompts
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


  // TODO(human): Register resources and prompts
  // Iterate over clothingResources and whatToWearPrompts to register them with the server
  // Use Object.entries() to iterate over the exported objects
  // For resources: call server.registerResource(name, resource.template, resource.metadata, resource.handler)
  // For prompts: call server.registerPrompt(name, prompt.metadata, prompt.handler)

  return server;
}
