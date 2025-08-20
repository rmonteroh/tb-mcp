import express, { Request, Response } from "express";
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

function createMcpServer() {
  const server = new McpServer({
    name: "ticketbeep-mcp-http-stateless",
    version: "1.0.0",
  });

  // Register shared tools, resources, and prompts
  registerApiTools(server);
  registerApiResources(server);
  registerApiPrompts(server);

  return server;
}

const app = express();
app.use(express.json());

app.post("/mcp", async (req: Request, res: Response) => {
  try {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      console.log("Request closed");
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error processing MCP request:", error);
    res.status(500).json({
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: "Internal Server Error",
      },
      id: null,
    });
  }
});

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

app.listen(port, () => {
  console.log(`MCP server running on port ${port}`);
  if (config.ticketbeep.apiKey) {
    console.log("TicketBeep API key authentication enabled");
  } else {
    console.log("No TicketBeep API key configured - authentication disabled");
  }
});
