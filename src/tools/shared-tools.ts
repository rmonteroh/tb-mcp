import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ZodRawShape } from "zod";

// Tool definition interface
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ZodRawShape;
  handler: (
    args: any,
    extra?: { authContext?: string }
  ) => Promise<{ content: { type: "text"; text: string }[] }>;
}

// Generic function to register tools from an array
export function registerToolsFromArray(
  server: McpServer,
  tools: ToolDefinition[]
): void {
  tools.forEach((tool) => {
    server.tool(
      tool.name,
      tool.description,
      tool.inputSchema,
      async (args, _extra) => {
        return tool.handler(args, undefined);
      }
    );
  });
}

// Generic function to register resources from an array using simple approach
export function registerResourcesFromArray(
  server: McpServer,
  resources: any[]
): void {
  resources.forEach((resource) => {
    server.resource(resource.name, resource.uri, resource.handler);
  });
}

// Generic function to register prompts from an array using simple approach
export function registerPromptsFromArray(
  server: McpServer,
  prompts: any[]
): void {
  prompts.forEach((prompt) => {
    server.prompt(
      prompt.name,
      prompt.description,
      prompt.arguments || {},
      prompt.handler
    );
  });
}
