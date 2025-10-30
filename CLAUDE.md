# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server implementation that demonstrates all three core MCP primitives: **Tools**, **Resources**, and **Prompts**. The server provides weather information and clothing recommendations, using the Open-Meteo API for worldwide weather data coverage.

**Core Features:**
- **Tools**: Weather data retrieval (current conditions and forecasts)
- **Resources**: Clothing recommendations for different weather conditions
- **Prompts**: "What to wear" workflow combining weather data with clothing guidelines

## Build and Development Commands

```bash
# Build the project (compiles TypeScript and sets executable permissions)
npm run build

# Test (currently not implemented)
npm test
```

The build output goes to the `./build` directory, and the compiled `build/index.js` serves as the executable entry point.

## Architecture

The codebase follows a **feature-modular architecture** with co-located types, separating concerns into distinct modules:

```
src/
├── index.ts                     # Entry point - transport setup
├── server.ts                    # MCP server configuration - registration loops
├── api/
│   └── open-meteo-client.ts     # Open-Meteo API client implementation
├── tools/
│   ├── types.ts                 # Tool types & Zod schemas
│   └── weather.ts               # Weather tool implementations
├── resources/
│   ├── types.ts                 # Resource types & data models
│   ├── clothing.ts              # Clothing recommendation data
│   └── clothing-resources.ts    # Resource implementations
└── prompts/
    ├── types.ts                 # Prompt types & schemas
    └── what-to-wear.ts          # Prompt implementations
```

**Architectural Principles:**
- **Co-located Types**: Each feature module has its own `types.ts` for discoverability
- **Separation of Concerns**: Data, types, and implementations are clearly separated
- **Consistent Patterns**: Tools, resources, and prompts follow the same export structure
- **DRY Registration**: Server uses loops to register features from exported objects

### Layer Responsibilities

1. **Entry Point** ([src/index.ts](src/index.ts)):
   - Minimal main function that creates the server and sets up stdio transport
   - Handles fatal errors and process exit

2. **Server Configuration** ([src/server.ts](src/server.ts)):
   - Creates `McpServer` instance with name and version
   - Iterates over exported feature objects using loops for registration
   - Uses short-form API: `.tool()`, `.resource()`, `.prompt()`
   - Clean, DRY registration code (no manual repetition)

3. **API Client Layer** ([src/api/open-meteo-client.ts](src/api/open-meteo-client.ts)):
   - Encapsulates all Open-Meteo API interactions
   - Generic `makeOpenMeteoRequest()` helper with error handling
   - Exported functions: `getCurrentWeather()`, `getForecast()`
   - Returns null on API failures for graceful degradation

4. **Tools Module** ([src/tools/](src/tools/)):
   - **types.ts**: Zod schemas, TypeScript types, and API response interfaces
   - **weather.ts**: Exports `weatherTools` object with tool definitions
   - Each tool has: description, inputSchema (Zod), and async handler
   - Formatting functions for user-friendly output with emojis
   - Helper functions for WMO weather codes and wind direction

5. **Resources Module** ([src/resources/](src/resources/)):
   - **types.ts**: Resource definition types and data model interfaces
   - **clothing.ts**: Static data with clothing recommendations for 6 weather conditions
   - **clothing-resources.ts**: Exports `clothingResources` object with resource definitions
   - Each resource has: template (URI pattern), metadata, and handler
   - Supports parameter completion for weather condition types

6. **Prompts Module** ([src/prompts/](src/prompts/)):
   - **types.ts**: Prompt definition types and Zod schemas
   - **what-to-wear.ts**: Exports `whatToWearPrompts` object with prompt definitions
   - Each prompt has: description, argsSchema (Zod), and async handler
   - Prompts combine resources and tools to create workflows
   - Fetches live weather data and provides clothing recommendations

### MCP Server Pattern

This codebase demonstrates all three MCP primitives:

1. **Server Initialization** ([src/server.ts:10-13](src/server.ts#L10-L13)): Creates an `McpServer` instance with name and version

2. **Registration** ([src/server.ts:15-28](src/server.ts#L15-L28)): Uses loops to register features
   ```typescript
   // Tools: server.tool(name, description, inputSchema, handler)
   for (const [name, tool] of Object.entries(weatherTools)) {
     server.tool(name, tool.description, tool.inputSchema, tool.handler);
   }

   // Resources: server.resource(name, template, metadata, handler)
   for (const [name, resource] of Object.entries(clothingResources)) {
     server.resource(name, resource.template, resource.metadata, resource.handler);
   }

   // Prompts: server.prompt(name, description, argsSchema, handler)
   for (const [name, prompt] of Object.entries(whatToWearPrompts)) {
     server.prompt(name, prompt.description, prompt.argsSchema, prompt.handler);
   }
   ```

3. **Transport Layer** ([src/index.ts:10-14](src/index.ts#L10-L14)): Uses `StdioServerTransport` for stdio-based communication

### Implementation Patterns

**Tools** ([src/tools/weather.ts](src/tools/weather.ts)):
- Export object with tool name as key
- Each tool has: `description`, `inputSchema` (Zod object), `handler` (async function)
- Handler returns `{ content: [{ type: "text", text: string }] }`
- Examples: `get_current_weather`, `get_forecast`

**Resources** ([src/resources/clothing-resources.ts](src/resources/clothing-resources.ts)):
- Export object with resource name as key
- Each resource has: `template` (ResourceTemplate with URI pattern), `metadata` (title, description), `handler` (async function)
- Handler returns `{ contents: [{ uri, mimeType, text }] }`
- URI templates support parameters with auto-completion (e.g., `weather://clothing/{condition}`)
- Examples: 6 weather conditions (hot, cold, mild, rainy, snowy, windy)

**Prompts** ([src/prompts/what-to-wear.ts](src/prompts/what-to-wear.ts)):
- Export object with prompt name as key
- Each prompt has: `description`, `argsSchema` (Zod object), `handler` (async function)
- Handler returns `{ title, description, messages: [{ role, content }] }`
- Prompts can combine tools (fetch weather) and resources (clothing data) into workflows
- Example: `what-to-wear` prompt that fetches weather and provides clothing recommendations

### API Integration

Uses the Open-Meteo API at `https://api.open-meteo.com`:
- All requests go through `makeOpenMeteoRequest()` helper in [src/api/open-meteo-client.ts](src/api/open-meteo-client.ts)
- Free and open-source API with no authentication required
- Global coverage with data from 20+ national weather services
- Supports current conditions, hourly forecasts, and daily forecasts (up to 16 days)
- WMO weather codes are converted to human-readable descriptions
- Centralized error handling returns null on failures

## Key Design Patterns

1. **Feature-Modular Architecture**: Each feature (tools, resources, prompts) has its own directory with co-located types
2. **Locality of Behavior**: Types live with the code that uses them for better discoverability
3. **Type Safety**: TypeScript interfaces + Zod schemas provide compile-time and runtime validation
4. **Consistent Export Pattern**: All features export objects with name keys and definition values
5. **DRY Registration**: Server uses loops over exported objects instead of manual registration
6. **Error Handling**: Graceful degradation - API failures return error messages rather than throwing
7. **Formatting**: Separate formatting functions keep handlers clean with emoji-rich, user-friendly output
8. **Single Responsibility**: Each file has one clear purpose (types, data, implementations)
9. **Short-Form API**: Consistent use of `.tool()`, `.resource()`, `.prompt()` methods

## Adding New Features

### Adding Tools

1. **To add more weather tools**:
   - Add types to [src/tools/types.ts](src/tools/types.ts)
   - Add tool definition to `weatherTools` object in [src/tools/weather.ts](src/tools/weather.ts)
   - Tool automatically registers via the loop in [src/server.ts](src/server.ts)

2. **To add a new tool category** (e.g., location tools):
   - Add types to [src/tools/types.ts](src/tools/types.ts) (or create `location-types.ts`)
   - Create [src/tools/location.ts](src/tools/location.ts) following the pattern:
     ```typescript
     export const locationTools = {
       "tool-name": {
         description: "...",
         inputSchema: { /* Zod schemas */ },
         handler: async (args) => { /* implementation */ }
       }
     };
     ```
   - Import and add to loop in [src/server.ts](src/server.ts):
     ```typescript
     import { locationTools } from "./tools/location.js";
     for (const [name, tool] of Object.entries(locationTools)) {
       server.tool(name, tool.description, tool.inputSchema, tool.handler);
     }
     ```

3. **If tool needs new API**:
   - Create API client in [src/api/](src/api/) directory (e.g., `geocoding-client.ts`)
   - Export functions that return typed data or null on error
   - Import in your tool handler file

### Adding Resources

1. **To add more clothing resources**:
   - Add data to [src/resources/clothing.ts](src/resources/clothing.ts)
   - Add resource definition to `clothingResources` object in [src/resources/clothing-resources.ts](src/resources/clothing-resources.ts)
   - Resource automatically registers via the loop in [src/server.ts](src/server.ts)

2. **To add a new resource category** (e.g., location data):
   - Add data model types to [src/resources/types.ts](src/resources/types.ts)
   - Create data file [src/resources/location-data.ts](src/resources/location-data.ts)
   - Create [src/resources/location-resources.ts](src/resources/location-resources.ts):
     ```typescript
     export const locationResources = {
       "resource-name": {
         template: new ResourceTemplate("app://path/{param}", { /* completion */ }),
         metadata: { title: "...", description: "..." },
         handler: async (uri, variables) => { /* implementation */ }
       }
     };
     ```
   - Import and add to loop in [src/server.ts](src/server.ts)

### Adding Prompts

1. **To add more prompts**:
   - Add schemas to [src/prompts/types.ts](src/prompts/types.ts)
   - Add prompt definition to appropriate prompts file
   - Prompt automatically registers via the loop in [src/server.ts](src/server.ts)

2. **To add a new prompt category**:
   - Add types/schemas to [src/prompts/types.ts](src/prompts/types.ts)
   - Create prompt file [src/prompts/new-category.ts](src/prompts/new-category.ts):
     ```typescript
     export const myPrompts = {
       "prompt-name": {
         description: "...",
         argsSchema: { /* Zod schemas */ },
         handler: async (args) => { /* implementation */ }
       }
     };
     ```
   - Import and add to loop in [src/server.ts](src/server.ts)

## Understanding MCP Primitives

This server demonstrates all three core MCP primitives. Understanding when to use each is key:

### Tools
**What**: Functions that AI can call to perform actions
**When to use**: Dynamic operations, API calls, computations
**Examples**: Fetch current weather, get forecast
**Think of as**: Verbs - actions the AI can perform

### Resources
**What**: Data/context that AI can read
**When to use**: Static or semi-static information, reference data, documentation
**Examples**: Clothing recommendations, configuration data, API documentation
**Think of as**: Nouns - information sources the AI can reference
**Key difference from tools**: Resources expose data; tools perform actions

### Prompts
**What**: Reusable workflows that combine tools and resources
**When to use**: Multi-step processes, common user tasks, guided experiences
**Examples**: "What to wear" combines weather tool + clothing resource
**Think of as**: Recipes - structured workflows orchestrating tools and resources
**Key difference**: Prompts are user-invoked and return pre-populated conversation context

## Running the Server

The server is designed to be run as an MCP server by an MCP client (like Claude Desktop):
```bash
node build/index.js
```

The server communicates via stdio and logs to stderr to avoid interfering with the MCP protocol on stdout.

## What This Server Provides

**Available Tools:**
- `get_current_weather` - Get current weather conditions for any location
- `get_forecast` - Get multi-day weather forecast (1-16 days)

**Available Resources:**
- `weather://clothing/{condition}` - Clothing recommendations for: hot, cold, mild, rainy, snowy, windy

**Available Prompts:**
- `what-to-wear` - Combines current weather with clothing recommendations for personalized advice
