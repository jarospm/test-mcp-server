# MCP Weather Server

A Model Context Protocol (MCP) server that demonstrates all three core MCP primitives: **Tools**, **Resources**, and **Prompts**. Provides weather information and clothing recommendations using the Open-Meteo API.

## Features

### Tools
- `get_current_weather` - Get current weather conditions for any location
- `get_forecast` - Get multi-day weather forecast (1-16 days)

### Resources
- `weather://clothing/{condition}` - Clothing recommendations for different weather conditions:
  - hot, cold, mild, rainy, snowy, windy

### Prompts
- `what-to-wear` - Combines current weather with clothing recommendations for personalized advice

## Installation

```bash
npm install
```

## Building

Build the TypeScript project and set executable permissions:

```bash
npm run build
```

The compiled output will be in the `./build` directory, with `build/index.js` as the entry point.

## Running the Server

The server communicates via stdio and is designed to be run by an MCP client (like Claude Desktop):

```bash
node build/index.js
```

### Configuring with Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/absolute/path/to/test-mcp-server/build/index.js"]
    }
  }
}
```

## Testing with MCP Inspector

The MCP Inspector provides a web interface for testing your server's tools, resources, and prompts.

### Quick Start

```bash
# 1. Build your server
npm run build

# 2. Launch the Inspector
npx @modelcontextprotocol/inspector node build/index.js
```

This will:
- Start the Inspector web interface (typically at `http://localhost:5173`)
- Connect to your server via stdio
- Open your browser automatically

### Testing Features

Once the Inspector is running, you can test:

1. **Tools Tab**:
   - Test `get_current_weather` with locations like "San Francisco, CA"
   - Test `get_forecast` with different day counts (1-16)

2. **Resources Tab**:
   - Browse clothing resources: `weather://clothing/hot`, `weather://clothing/cold`, etc.
   - View resource metadata and contents

3. **Prompts Tab**:
   - Try the `what-to-wear` prompt with different locations
   - See how prompts combine tools and resources

4. **Notifications Pane**:
   - Monitor server logs and debug messages
   - Watch for errors or API issues

### Development Workflow

1. Make changes to your code
2. Rebuild: `npm run build`
3. Refresh the Inspector page to reconnect
4. Test your changes

## Architecture

The project follows a feature-modular architecture:

```
src/
├── index.ts                     # Entry point - transport setup
├── server.ts                    # MCP server configuration
├── api/
│   └── open-meteo-client.ts     # Open-Meteo API client
├── tools/
│   ├── types.ts                 # Tool types & schemas
│   └── weather.ts               # Weather tool implementations
├── resources/
│   ├── types.ts                 # Resource types
│   ├── clothing.ts              # Clothing data
│   └── clothing-resources.ts    # Resource implementations
└── prompts/
    ├── types.ts                 # Prompt types & schemas
    └── what-to-wear.ts          # Prompt implementations
```

## API

Uses the free and open-source [Open-Meteo API](https://open-meteo.com):
- No authentication required
- Global coverage from 20+ national weather services
- Current conditions and forecasts up to 16 days

## Development

See [CLAUDE.md](CLAUDE.md) for detailed development guidance, including how to add new tools, resources, and prompts.

## License

MIT
