import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ZodRawShape } from "zod";

// Tool definition interface
/* export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ZodRawShape;
  handler: (
    args: any,
    extra?: any
  ) => Promise<{ content: { type: "text"; text: string }[] }>;
} */

// Import tools from organized modules
import { allTools } from "./tools.js";
import { ToolDefinition } from "./types.js";

// Re-export for backward compatibility
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
