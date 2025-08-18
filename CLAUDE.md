# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Start
```bash
npm run build          # Compile TypeScript to dist/ folder
npm start             # Start the built MCP server (stdio transport)
npm run start:client  # Start with client testing mode
npm run start:inspector # Start with MCP inspector for debugging
```

### Development
```bash
npm run dev           # Start with hot reload (stdio transport)
npm run dev:express   # Start HTTP server on port 3001
npm run dev:server    # Start MCP server directly
```

### Quality Assurance
```bash
npm run lint          # Run ESLint on TypeScript files
npm run format        # Format code with Prettier  
npm test             # Run Jest tests
```

## Architecture Overview

This is a Model Context Protocol (MCP) server that provides access to the TicketBeep API for music industry media planning and campaign management.

### Key Components

**MCP Server Entry Points:**
- `src/index.ts` - Main stdio transport server (primary entry point)
- `src/mcp-server.ts` - HTTP transport server for web integration
- `src/web-server.ts` - Express HTTP server with session management

**Core Services:**
- `src/services/ticketbeep-api.ts` - Comprehensive API client for all TicketBeep endpoints
- `src/config/index.ts` - Environment-based configuration management

**Tool System:**
- `src/tools/index.ts` - Complete tool definitions with Zod validation
- `src/schemas/index.ts` - Zod schemas for request/response validation
- `src/types/index.ts` - TypeScript type definitions

### Transport Modes

The server supports two transport modes:
1. **Stdio Transport** (`src/index.ts`) - For CLI integration and desktop apps
2. **HTTP Transport** (`src/mcp-server.ts`) - For web applications with session management

### Tool Categories

**Media Planning Tools:**
- Artist search and metadata retrieval
- Media plan generation with budget allocation
- Venue and event discovery
- Geographic targeting and zipcode scoring

**Campaign Management:**
- CRUD operations for marketing campaigns
- Campaign analytics and reporting

**Billboard & Radio Tools:**
- Billboard inventory search and filtering
- Analog radio station queries
- Geographic-based media buying

**Dashboard Analytics:**
- Ticket pricing data
- Revenue analytics
- Genre and city performance metrics

**Activity Tracking:**
- User session management
- Action logging and analytics

## Environment Configuration

Copy `env.example` to `.env` and configure:
```env
TICKETBEEP_API_BASE_URL=https://ticketbeep-api-dev.up.railway.app
TICKETBEEP_API_KEY=your_api_key_here
TICKETBEEP_AUTH_TOKEN=optional_auth_token
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=localhost
GEMINI_API_KEY=optional_gemini_key
```

## MCP Configuration

The server is configured for Claude Desktop via `mcp-config.json`. The configuration includes the API key and base URL for the TicketBeep service.

## Key Implementation Notes

- All tools use Zod schema validation for type safety
- API client includes automatic token management and error handling
- Tools return JSON responses formatted for MCP text content
- The codebase uses ES modules with TypeScript compilation to CommonJS
- Authentication flows through API keys and Bearer tokens depending on endpoint requirements

## Testing

When testing tools, start with artist search to get valid IDs, then use those IDs for media plan generation and other related operations.