import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { tools } from "./tools";
import z, { ZodRawShape } from "zod";
import { ticketbeepApi } from "./services/ticketbeep-api";

const app = express();
app.use(express.json());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication
app.post("/mcp", async (req, res) => {
  // Check for existing session ID
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        transports[sessionId] = transport;
      },
      // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
      // locally, make sure to set:
      // enableDnsRebindingProtection: true,
      // allowedHosts: ['127.0.0.1'],
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };
    const server = new McpServer({
      name: "example-server",
      version: "1.0.0",
    });

    // ... set up server resources, tools, and prompts ...
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
        venue: z
          .string()
          .min(1, "Venue is required")
          .default("0b95l17898c57an"),
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

    // Connect to the MCP server
    await server.connect(transport);
  } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: No valid session ID provided",
      },
      id: null,
    });
    return;
  }

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// Handle GET requests for server-to-client notifications via SSE
app.get("/mcp", handleSessionRequest);

// Handle DELETE requests for session termination
app.delete("/mcp", handleSessionRequest);

app.listen(3001, () => {
  console.log("MCP server running on port 3001");
});
