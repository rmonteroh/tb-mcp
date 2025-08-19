// Main index file for tools, resources, and prompts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import tools from the main api.tools file (working version)
import {
  apiTools,
  registerApiTools as apiRegisterTools,
  registerApiResources as apiRegisterResources,
  registerApiPrompts as apiRegisterPrompts,
} from "./api.tools.js";

// Export tools for direct access
export const allTools = apiTools;
export { apiTools };

// Main registration functions (use the working ones from api.tools)
export function registerApiTools(server: McpServer): void {
  apiRegisterTools(server);
}

export function registerApiResources(server: McpServer): void {
  apiRegisterResources(server);
}

export function registerApiPrompts(server: McpServer): void {
  apiRegisterPrompts(server);
}

// Combined registration function for convenience
export function registerAll(server: McpServer): void {
  registerApiTools(server);
  registerApiResources(server);
  registerApiPrompts(server);
}
