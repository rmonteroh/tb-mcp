import {
  McpServer,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "./config/index.js";
import { tools } from "./tools/index.js";
import { ZodRawShape } from "zod";
import { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import { schemas } from "./schemas/index.js";
import { validateWithZodSafe } from "./utils/schema-converter.js";
import { ticketbeepApi } from "./services/ticketbeep-api.js";
import { z } from "zod";

async function main() {
  console.log("Starting TicketBeep MCP Server...");
  console.log(`API Base URL: ${config.ticketbeep.apiBaseUrl}`);
  console.log(`MCP Server: ${config.mcp.host}:${config.mcp.port}`);

  // Create the MCP server
  const server = new McpServer({
    name: "ticketbeep-mcp",
    version: "1.0.0",
  });

  // Register all tools
  server.tool(
    "search_artists",
    "Search for artists by name",
    {
      name: z.string().min(1, "Artist name is required"),
    },
    async ({ name }) => {
      const result = await ticketbeepApi.searchArtists(name);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "get_artist_by_id",
    "Get artist by id",
    {
      id: z.string().min(1, "Artist id is required"),
    },
    async ({ id }) => {
      const result = await ticketbeepApi.getArtistById(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "generate_media_plan",
    "Generate media plan, for generating media plan you need to provide the artist id, venue id, total budget, start date, end date and config, you can search first the artist by name get the first element and then look artist by id using the first element id, after that you can use the artist id founded to generate the media plan",
    {
      artistId: z.string().min(1, "Artist id is required").default("308"),
      venue: z.string().min(1, "Venue is required").default("0b95l17898c57an"),
      totalBudget: z.number().min(1, "Total budget is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      config: z.object({
        digital: z.boolean().default(true),
        geo: z.boolean().default(true),
        influencer: z.boolean().default(true),
        ooh: z.boolean().default(true),
        analog: z.boolean().default(true),
      }),
    },
    async ({ artistId, venue, totalBudget, startDate, endDate, config }) => {
      // Format date to YYYY-MM-DD
      const formattedStartDate = new Date(startDate)
        .toISOString()
        .split("T")[0];
      const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
      const result = await ticketbeepApi.generateMediaPlan({
        artistId,
        venue,
        totalBudget,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        config,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

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
