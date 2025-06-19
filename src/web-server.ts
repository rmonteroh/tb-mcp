import express, { Request, Response } from "express";
import { tools } from "./tools/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const app = express();
app.use(express.json());

const server = new McpServer(
  {
    name: "ticketbeep-server",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

// Dynamically create endpoints for each tool
for (const tool of tools) {
  app.post(`/tools/${tool.name}`, async (req: Request, res: Response) => {
    try {
      const extra = {
        signal: new AbortController().signal,
        requestId: Math.random().toString(36).substring(2),
        sendNotification: async () => {},
        sendRequest: async () => {
          throw new Error("sendRequest not supported in HTTP context");
        },
      };
      const result = await tool.handler(req.body, extra);
      res.json(result);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        error: err.message || "Tool execution error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express MCP HTTP server running on port ${PORT}`);
});
