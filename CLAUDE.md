# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server implementation that provides global weather information tools. It's a simple MCP server that exposes weather-related tools via the `@modelcontextprotocol/sdk`, using the Open-Meteo API for worldwide weather data coverage.

## Build and Development Commands

```bash
# Build the project (compiles TypeScript and sets executable permissions)
npm run build

# Test (currently not implemented)
npm test
```

The build output goes to the `./build` directory, and the compiled `build/index.js` serves as the executable entry point.

## Architecture

The codebase follows a layered architecture pattern, separating concerns into distinct modules:

```
src/
├── index.ts                  # Entry point - transport setup
├── server.ts                 # MCP server configuration and tool registration
├── types.ts                  # Shared TypeScript types and Zod schemas
├── api/
│   └── open-meteo-client.ts  # Open-Meteo API client implementation
└── tools/
    └── weather.ts            # Weather tool handlers
```

### Layer Responsibilities

1. **Entry Point** ([src/index.ts](src/index.ts)):
   - Minimal main function that creates the server and sets up stdio transport
   - Handles fatal errors and process exit

2. **Server Configuration** ([src/server.ts](src/server.ts)):
   - Creates `McpServer` instance with name and version
   - Registers all tools with their handlers
   - Central place to add new tools or resources

3. **Types & Schemas** ([src/types.ts](src/types.ts)):
   - Zod schemas for input validation (GetCurrentWeatherArgsSchema, GetForecastArgsSchema)
   - TypeScript interfaces for API responses (OpenMeteoCurrentResponse, OpenMeteoForecastResponse)
   - Type inference from Zod schemas

4. **API Client Layer** ([src/api/open-meteo-client.ts](src/api/open-meteo-client.ts)):
   - Encapsulates all Open-Meteo API interactions
   - Generic `makeOpenMeteoRequest()` helper with error handling
   - Exported functions: `getCurrentWeather()`, `getForecast()`
   - Returns null on API failures for graceful degradation

5. **Tool Handlers** ([src/tools/weather.ts](src/tools/weather.ts)):
   - Exports `weatherTools` object with tool definitions
   - Each tool has: description, inputSchema (Zod), and async handler
   - Formatting functions (like `formatCurrentWeather()`, `formatForecast()`) for output presentation
   - Helper functions for WMO weather code interpretation and wind direction conversion
   - Validation and error handling at the tool level

### MCP Server Pattern

This codebase follows the standard MCP server architecture:

1. **Server Initialization** ([src/server.ts:8-11](src/server.ts#L8-L11)): Creates an `McpServer` instance with name and version
2. **Tool Registration** ([src/server.ts:14-26](src/server.ts#L14-L26)): Tools are registered using `server.tool()` with schema validation via Zod
3. **Transport Layer** ([src/index.ts:10-14](src/index.ts#L10-L14)): Uses `StdioServerTransport` for stdio-based communication (standard for MCP servers)

### Tool Implementation Pattern

Each tool in [src/tools/weather.ts](src/tools/weather.ts) follows this structure:
- Tool name and description
- Input schema defined with Zod validators (inline object with Zod schemas)
- Async handler function that returns `{ content: [{ type: "text", text: string }] }`

The two weather tools demonstrate common patterns:
- **get_current_weather**: Single API call with latitude/longitude and optional temperature unit
- **get_forecast**: Single API call with latitude/longitude, optional forecast days (1-16), and temperature unit

### API Integration

Uses the Open-Meteo API at `https://api.open-meteo.com`:
- All requests go through `makeOpenMeteoRequest()` helper in [src/api/open-meteo-client.ts](src/api/open-meteo-client.ts)
- Free and open-source API with no authentication required
- Global coverage with data from 20+ national weather services
- Supports current conditions, hourly forecasts, and daily forecasts (up to 16 days)
- WMO weather codes are converted to human-readable descriptions
- Centralized error handling returns null on failures

## Key Design Patterns

1. **Layered Architecture**: Clear separation between entry point, server setup, tool handlers, and API clients
2. **Type Safety**: TypeScript interfaces define API response shapes; Zod schemas validate inputs
3. **Error Handling**: Graceful degradation - API failures return error messages rather than throwing
4. **Formatting**: Separate formatting functions (like `formatCurrentWeather()`, `formatForecast()`) keep tool handlers clean with emoji-rich, user-friendly output
5. **Validation**: Zod schemas enforce input constraints (e.g., coordinate ranges, forecast days 1-16, temperature units)
6. **Single Responsibility**: Each file has one clear purpose, making the codebase easy to extend

## Adding New Tools

To add new tools:

1. **If adding to existing category** (e.g., more weather tools):
   - Add tool definition to [src/tools/weather.ts](src/tools/weather.ts)
   - Register it in [src/server.ts](src/server.ts)

2. **If adding new category** (e.g., location tools):
   - Create `src/tools/location.ts` following the pattern in weather.ts
   - Export a `locationTools` object with tool definitions
   - Import and register in [src/server.ts](src/server.ts)

3. **If tool needs new API**:
   - Create API client in `src/api/` directory
   - Export functions that return typed data or null on error
   - Import in tool handler file

## Adding Resources

To add MCP resources, follow the same pattern as tools:
- Create `src/resources/` directory
- Define resource handlers in separate files
- Register in [src/server.ts](src/server.ts) using `server.resource()`

## Running the Server

The server is designed to be run as an MCP server by an MCP client (like Claude Desktop):
```bash
node build/index.js
```

The server communicates via stdio and logs to stderr to avoid interfering with the MCP protocol on stdout.
