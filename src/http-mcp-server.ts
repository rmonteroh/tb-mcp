import express, { Request, Response, NextFunction } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  registerApiResources,
  registerApiPrompts,
  allTools,
} from "./tools/index.js";
import config from "./config/index.js";
import { tokenValidator, AuthContext } from "./auth/token-validator.js";

function createMcpServer(authContext?: string) {
  const server = new McpServer({
    name: "ticketbeep-mcp-http-stateless",
    version: "1.0.0",
  });

  // Register resources and prompts normally
  registerApiResources(server);
  registerApiPrompts(server);

  // Register tools with auth context injection
  allTools.forEach((tool) => {
    server.tool(
      tool.name,
      tool.description,
      tool.inputSchema,
      async (args, _extra) => {
        return tool.handler(args, { authContext });
      }
    );
  });

  return server;
}

// Extend Request interface to include auth context
declare global {
  namespace Express {
    interface Request {
      // authContext?: AuthContext;
      authContext?: string;
    }
  }
}

const app = express();
app.use(express.json());

// Authentication middleware
async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      jsonrpc: "2.0",
      error: {
        code: -32600,
        message: "Authorization header required",
      },
      id: null,
    });
    return;
  }

  // Extract the token from the authorization header
  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  /* const validationResult = await tokenValidator.validateToken(authHeader);

  if (!validationResult.valid) {
    res.status(401).json({
      jsonrpc: "2.0",
      error: {
        code: -32600,
        message: validationResult.error || "Invalid token",
      },
      id: null,
    });
    return;
  } */

  // Add auth context to request
  // req.authContext = tokenValidator.getAuthContext(authHeader) || undefined;
  req.authContext = token;
  next();
}

app.post("/mcp", authenticateToken, async (req: Request, res: Response) => {
  try {
    const server = createMcpServer(req.authContext);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      console.log(`Request closed for user: ${req.authContext}`);
      transport.close();
      server.close();
    });

    // Log authenticated request
    console.log(`MCP request from user: ${req.authContext}`);

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
