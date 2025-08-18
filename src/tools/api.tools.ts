import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ticketbeepApi } from "../services/ticketbeep-api.js";
import { z, ZodRawShape } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..", "..");

// Tool definition interface
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ZodRawShape;
  handler: (args: any, extra?: any) => Promise<{ content: { type: "text"; text: string }[] }>;
}

// Import tools from organized modules
import { allTools } from "./tools.js";

// Re-export for backward compatibility
export const apiTools: ToolDefinition[] = allTools;

// Generic function to register tools from an array
export function registerToolsFromArray(server: McpServer, tools: ToolDefinition[]): void {
  tools.forEach(tool => {
    server.tool(
      tool.name,
      tool.description,
      tool.inputSchema,
      tool.handler
    );
  });
}

// Register API tools function
export function registerApiTools(server: McpServer): void {
  registerToolsFromArray(server, allTools);
}

export function registerApiResources(server: McpServer): void {
  // Contract resource
  server.resource("ticketbeep-contract", "doc://contract.txt", async () => ({
    contents: [
      {
        text: fs.readFileSync(
          path.join(rootDir, "src", "assets", "contract.txt"),
          "utf8"
        ),
        uri: "contract.txt",
        mimeType: "text/plain",
      },
    ],
  }));

  // API documentation resource
  server.resource("ticketbeep-api-docs", "doc://api-docs.md", async () => {
    const apiDocsContent = `# TicketBeep API Documentation

## Overview
The TicketBeep API provides comprehensive access to music industry data for media planning.

## Main Tools
- \`search_artists\`: Find artists by name
- \`get_artist_by_id\`: Get detailed artist information
- \`generate_media_plan\`: Create comprehensive media plans

## Quick Start
1. Search for an artist
2. Get artist details
3. Generate media plan`;

    return {
      contents: [
        {
          text: apiDocsContent,
          uri: "api-docs.md",
          mimeType: "text/markdown",
        },
      ],
    };
  });
}

export function registerApiPrompts(server: McpServer): void {
  server.prompt(
    "generate_media_plan",
    "Generate a media plan for an artist's event",
    {},
    async () => {
      return {
        messages: [
          {
            role: "assistant",
            content: {
              type: "text",
              text:
                "To generate a media plan, I'll need some information. Please provide:\n" +
                "1. The artist's name\n" +
                "2. Your total budget\n" +
                "3. Start date (YYYY-MM-DD)\n" +
                "4. End date (YYYY-MM-DD)",
            },
          },
        ],
        description:
          "This prompt helps generate a comprehensive media plan for an artist's event, including digital, geo-targeting, influencer, OOH, and analog marketing strategies.",
      };
    }
  );

  server.prompt(
    "artist_discovery",
    "Help users discover and explore artist information",
    {},
    async () => {
      return {
        messages: [
          {
            role: "assistant",
            content: {
              type: "text",
              text:
                "I'll help you discover artist information. Simply provide an artist name and I'll search for matches and show you detailed profiles, statistics, and analytics.",
            },
          },
        ],
        description: "Interactive prompt for discovering artist information and analytics.",
      };
    }
  );
}