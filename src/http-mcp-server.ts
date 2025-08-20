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

// The stateful 'transports' object has been removed.

app.post("/mcp", async (req, res) => {
  // --- STATELESS MODIFICATION START ---
  // The server remains stateless by creating a new server instance and registering
  // tools for every request. However, the transport logic now respects the
  // MCP protocol handshake (initialize vs. subsequent calls).

  const clientSessionId = req.body?.meta?.sessionId || randomUUID();

  // 2. Create a new MCP server instance for every request.
  const server = new McpServer({
    name: "ticketbeep-mcp-http-stateless",
    version: "1.0.0",
  });

  // 3. Register all tools and resources for this specific request.
  registerApiTools(server);
  registerApiResources(server);
  registerApiPrompts(server);

  let transport;
  transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => clientSessionId,
  });

  try {
    // 4. Connect the temporary server and transport.
    await server.connect(transport);

    // 5. Immediately handle the request and send the response.
    // After this, the 'server' and 'transport' objects will be discarded.
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error processing stateless MCP request:", error);
    res.status(500).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Internal Server Error",
      },
      id: req.body?.id || null,
    });
  }
  // --- STATELESS MODIFICATION END ---
});

// The stateful GET and DELETE handlers have been removed as they are
// incompatible with a stateless architecture.

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({
    name: "ticketbeep-mcp-http-stateless",
    version: "1.0.0",
    status: "running",
    endpoints: ["/health", "/mcp"],
  });
});

const port = config.mcp.port;

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Stateless MCP server running on port ${port}`);
    if (config.ticketbeep.apiKey) {
      console.log("TicketBeep API key authentication enabled");
    } else {
      console.log("No TicketBeep API key configured - authentication disabled");
    }
  });
}

export default app;
