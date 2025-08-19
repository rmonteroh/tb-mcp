import { startMcpServer } from "./stdio-mcp-server.js";

startMcpServer().catch((error) => {
  console.error("Failed to start TicketBeep MCP Server:", error);
  process.exit(1);
});
