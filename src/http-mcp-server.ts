import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import {
  registerApiTools,
  registerApiResources,
  registerApiPrompts,
} from "./tools/index.js";
import config from "./config/index.js";

const app = express();
app.use(express.json());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication
app.post("/mcp", async (req, res) => {
  /* // Check for existing session ID
  const sessionIdFromBody = req.body?.meta?.sessionId;
  const sessionIdFromHeader = req.headers["mcp-session-id"] as
    | string
    | undefined;
  const sessionId = sessionIdFromBody || sessionIdFromHeader;

  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        transports[sessionId] = transport;
      },
      // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
      // locally, make sure to set:
      // enableDnsRebindingProtection: true,
      // allowedHosts: ['127.0.0.1'],
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    }; */

  const clientSessionId = req.body?.meta?.sessionId;

  // 1. Create a new transport for this specific request.
  const transport = new StreamableHTTPServerTransport({
    // If the client sends an ID, use it. Otherwise, generate a new one.
    // This ensures the client gets a consistent session ID back in the response.
    sessionIdGenerator: () => clientSessionId || randomUUID(),
  });
  const server = new McpServer({
    name: "ticketbeep-mcp-http",
    version: "1.0.0",
  });

  // Register shared tools, resources, and prompts
  registerApiTools(server);
  registerApiResources(server);
  registerApiPrompts(server);

  // Connect to the MCP server
  await server.connect(transport);
  /* } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: No valid session ID provided",
      },
      id: null,
    });
    return;
  } */

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// Handle GET requests for server-to-client notifications via SSE
app.get("/mcp", handleSessionRequest);

// Handle DELETE requests for session termination
app.delete("/mcp", handleSessionRequest);

// Health check endpoint (optional, for monitoring)
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root endpoint for basic info
app.get("/", (req, res) => {
  res.json({
    name: "ticketbeep-mcp-http",
    version: "1.0.0",
    status: "running",
    endpoints: ["/health", "/mcp"],
  });
});

const port = config.mcp.port;

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`MCP server running on port ${port}`);
    if (config.ticketbeep.apiKey) {
      console.log("TicketBeep API key authentication enabled");
    } else {
      console.log("No TicketBeep API key configured - authentication disabled");
    }
  });
}

export default app;
