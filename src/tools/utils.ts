import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolDefinition } from "./types";
import { allTools } from "./tools.js";

export function extractTokenFromAuthContext(extra?: {
  authContext?: string;
}): string {
  return extra?.authContext || "";
}

export const apiTools: ToolDefinition[] = allTools;

// Generic function to register tools from an array
export function registerToolsFromArray(
  server: McpServer,
  tools: ToolDefinition[]
): void {
  tools.forEach((tool) => {
    server.tool(tool.name, tool.description, tool.inputSchema, tool.handler);
  });
}

// Register API tools function
export function registerApiTools(server: McpServer): void {
  registerToolsFromArray(server, allTools);
}
