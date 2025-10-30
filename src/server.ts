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
  for (const [name, tool] of Object.entries(weatherTools)) {
    server.tool(name, tool.description, tool.inputSchema, tool.handler);
  }

  // Register clothing resources
  for (const [name, resource] of Object.entries(clothingResources)) {
    server.resource(name, resource.template, resource.metadata, resource.handler);
  }

  // Register what-to-wear prompts
  for (const [name, prompt] of Object.entries(whatToWearPrompts)) {
    server.prompt(name, prompt.description, prompt.argsSchema, prompt.handler);
  }

  return server;
}
