import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "./config/index.js";
import { registerApiTools, registerApiResources, registerApiPrompts } from "./tools/index.js";

async function main() {
  console.log("Starting TicketBeep MCP Server...");
  console.log(`API Base URL: ${config.ticketbeep.apiBaseUrl}`);
  console.log(`MCP Server: ${config.mcp.host}:${config.mcp.port}`);

  // Create the MCP server
  const server = new McpServer({
    name: "ticketbeep-mcp",
    version: "1.0.0",
  });

  // Register shared tools, resources, and prompts
  registerApiTools(server);
  registerApiResources(server);
  registerApiPrompts(server);

  // Set up the transport
  const transport = new StdioServerTransport();

  // Start the server
  await server.connect(transport);

  console.log("TicketBeep MCP Server is running...");

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\nShutting down TicketBeep MCP Server...");
    await server.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\nShutting down TicketBeep MCP Server...");
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Failed to start TicketBeep MCP Server:", error);
  process.exit(1);
});
