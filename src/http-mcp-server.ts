import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import {
  registerApiTools,
  registerApiResources,
  registerApiPrompts,
  allTools,
} from "./tools/index.js";
import config from "./config/index.js";

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const clientSessionId = req.body?.meta?.sessionId || randomUUID();

  console.log(`Received POST message for sessionId ${clientSessionId}`);
  console.log(`Request body:`, JSON.stringify(req.body, null, 2));

  try {
    // Create a temporary server instance for every request
    const server = new McpServer({
      name: "ticketbeep-mcp-stateless",
      version: "1.0.0",
    });

    // Register all tools and resources
    registerApiTools(server);
    registerApiResources(server);
    registerApiPrompts(server);

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => clientSessionId,
    });

    // Connect server and transport
    await server.connect(transport);

    // Let the transport handle all requests including initialization
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error processing MCP request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: `Internal Server Error: ${errorMessage}`,
      },
      id: req.body?.id || null,
    });
  }
});

// Stateless health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    serverType: "stateless",
    availableTools: allTools.length,
  });
});

// Stateless root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "ticketbeep-mcp-stateless",
    version: "1.0.0",
    status: "running",
    serverType: "stateless",
    endpoints: ["/health", "/mcp"],
    availableTools: allTools.length,
  });
});

const port = config.mcp.port;

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Stateless MCP server running on port ${port}`);
    console.log(`Available tools: ${allTools.length}`);
    if (config.ticketbeep.apiKey) {
      console.log("TicketBeep API key authentication enabled");
    } else {
      console.log("No TicketBeep API key configured - authentication disabled");
    }
  });
}

export default app;
