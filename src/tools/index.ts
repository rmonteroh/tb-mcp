import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ticketbeepApi } from "../services/ticketbeep-api.js";
import * as types from "../types/index.js";
import { schemas } from "../schemas/index.js";
import { validateWithZodSafe } from "../utils/schema-converter.js";
import { ZodRawShape } from "zod";
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

type ToolWithHandler = Tool & {
  handler: ToolCallback<ZodRawShape>;
};

// Media Plan Tools
export const generateMediaPlanTool: ToolWithHandler = {
  name: "generate_media_plan",
  description: "Generate a comprehensive media plan for an artist and venue",
  inputSchema: {
    type: "object",
    properties: {
      artistId: { type: "string", description: "The artist ID" },
      venue: { type: "string", description: "The venue name or ID" },
      totalBudget: {
        type: "number",
        description: "Total budget for the media plan",
      },
      startDate: { type: "string", description: "Start date in ISO format" },
      endDate: { type: "string", description: "End date in ISO format" },
      config: {
        type: "object",
        properties: {
          digital: { type: "boolean" },
          geo: { type: "boolean" },
          influencer: { type: "boolean" },
          ooh: { type: "boolean" },
          analog: { type: "boolean" },
        },
        required: ["digital", "geo", "influencer", "ooh", "analog"],
      },
      campaignId: { type: "string", description: "Optional campaign ID" },
    },
    required: [
      "artistId",
      "venue",
      "totalBudget",
      "startDate",
      "endDate",
      "config",
    ],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GenerateMediaPlan, args);
    const result = await ticketbeepApi.generateMediaPlan(validatedData);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const searchArtistsTool: ToolWithHandler = {
  name: "search_artists",
  description: "Search for artists by name",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Artist name to search for" },
    },
  },
  handler: async (args: any) => {
    console.log(
      "🔍 Search Artists Tool - Input args:",
      JSON.stringify(args, null, 2)
    );

    try {
      const validatedData = validateWithZodSafe(schemas.SearchArtists, args);
      console.log(
        "✅ Validation passed:",
        JSON.stringify(validatedData, null, 2)
      );

      const result = await ticketbeepApi.searchArtists(validatedData.name);
      console.log("✅ API call successful:", JSON.stringify(result, null, 2));

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      console.error("❌ Search Artists Tool Error:", error);
      console.error("❌ Error stack:", (error as Error).stack);
      throw error;
    }
  },
};

export const getArtistByIdTool: ToolWithHandler = {
  name: "get_artist_by_id",
  description: "Get detailed artist information by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "The artist ID" },
    },
    required: ["id"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetArtistById, args);
    const result = await ticketbeepApi.getArtistById(validatedData.id);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getArtistStatsTool: ToolWithHandler = {
  name: "get_artist_stats",
  description: "Get artist statistics and analytics",
  inputSchema: {
    type: "object",
    properties: {
      domain: { type: "string", description: "The domain for stats" },
      artistId: { type: "string", description: "The artist ID" },
    },
    required: ["domain", "artistId"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetArtistStats, args);
    const result = await ticketbeepApi.getArtistStats(
      validatedData.domain,
      validatedData.artistId
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getArtistMetadataTool: ToolWithHandler = {
  name: "get_artist_metadata",
  description: "Get artist metadata and career information",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "The artist ID" },
    },
    required: ["id"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetArtistMetadata, args);
    const result = await ticketbeepApi.getArtistMetadata(validatedData.id);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const scoreZipCodesTool: ToolWithHandler = {
  name: "score_zipcodes",
  description: "Score zipcodes based on artist data and demographics",
  inputSchema: {
    type: "object",
    properties: {
      zipcodes: { type: "array", items: { type: "string" } },
      artistId: { type: "string" },
      artistTotalFollowers: { type: "number" },
      ethnicity: {
        type: "object",
        properties: {
          code: { type: "string" },
          name: { type: "string" },
          weight: { type: "string" },
        },
        required: ["code", "name", "weight"],
      },
      artistCountryCode: { type: "string" },
      scoreFilters: {
        type: "object",
        properties: {
          nationality: { type: "boolean" },
          ethnicity: { type: "boolean" },
          sales: { type: "boolean" },
          income: { type: "boolean" },
          customerSpending: { type: "boolean" },
        },
        required: [
          "nationality",
          "ethnicity",
          "sales",
          "income",
          "customerSpending",
        ],
      },
    },
    required: [
      "zipcodes",
      "artistId",
      "artistTotalFollowers",
      "ethnicity",
      "artistCountryCode",
      "scoreFilters",
    ],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.ScoreZipCodes, args);
    const result = await ticketbeepApi.scoreZipCodes(validatedData);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const discoverEventsTool: ToolWithHandler = {
  name: "discover_events",
  description: "Find events in a specific area and time range",
  inputSchema: {
    type: "object",
    properties: {
      criteria: {
        type: "string",
        description: "JSON string with search criteria",
      },
    },
    required: ["criteria"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.DiscoverEvents, args);
    const result = await ticketbeepApi.discoverEvents(validatedData.criteria);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const discoverPlacesTool: ToolWithHandler = {
  name: "discover_places",
  description: "Search for places using Google Places API",
  inputSchema: {
    type: "object",
    properties: {
      criteria: {
        type: "string",
        description: "JSON string with search criteria",
      },
    },
    required: ["criteria"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.DiscoverPlaces, args);
    const result = await ticketbeepApi.discoverPlaces(validatedData.criteria);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getNearbyStatesTool: ToolWithHandler = {
  name: "get_nearby_states",
  description: "Get nearby states based on radius",
  inputSchema: {
    type: "object",
    properties: {
      stateCode: { type: "string", description: "The state code" },
      radius: { type: "number", description: "Radius in miles" },
    },
    required: ["stateCode", "radius"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetNearbyStates, args);
    const result = await ticketbeepApi.getNearbyStates(
      validatedData.stateCode,
      validatedData.radius
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Campaign Tools
export const createCampaignTool: ToolWithHandler = {
  name: "create_campaign",
  description: "Create a new marketing campaign",
  inputSchema: {
    type: "object",
    properties: {
      artistId: { type: "string" },
      venueId: { type: "string" },
      phases: { type: "object" },
      summary: { type: "object" },
      configuration: { type: "object" },
      userId: { type: "string" },
    },
    required: [
      "artistId",
      "venueId",
      "phases",
      "summary",
      "configuration",
      "userId",
    ],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.CreateCampaign, args);
    await ticketbeepApi.createCampaign(
      validatedData as types.CreateCampaignDto
    );
    return {
      content: [{ type: "text", text: "Campaign created successfully" }],
    };
  },
};

export const getCampaignsTool: ToolWithHandler = {
  name: "get_campaigns",
  description: "Retrieve all campaigns",
  inputSchema: {
    type: "object",
    properties: {},
  },
  handler: async () => {
    const result = await ticketbeepApi.getCampaigns();
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getCampaignByIdTool: ToolWithHandler = {
  name: "get_campaign_by_id",
  description: "Get a specific campaign by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "The campaign ID" },
    },
    required: ["id"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetCampaignById, args);
    const result = await ticketbeepApi.getCampaignById(validatedData.id);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const updateCampaignTool: ToolWithHandler = {
  name: "update_campaign",
  description: "Update an existing campaign",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "The campaign ID" },
      artistId: { type: "string" },
      venueId: { type: "string" },
      phases: { type: "object" },
      summary: { type: "object" },
      configuration: { type: "object" },
      userId: { type: "string" },
    },
    required: ["id"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.UpdateCampaign, args);
    const { id, ...data } = validatedData;
    await ticketbeepApi.updateCampaign(id, data as types.UpdateCampaignDto);
    return {
      content: [{ type: "text", text: "Campaign updated successfully" }],
    };
  },
};

export const deleteCampaignTool: ToolWithHandler = {
  name: "delete_campaign",
  description: "Delete a campaign",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "The campaign ID" },
    },
    required: ["id"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.DeleteCampaign, args);
    await ticketbeepApi.deleteCampaign(validatedData.id);
    return {
      content: [{ type: "text", text: "Campaign deleted successfully" }],
    };
  },
};

// Billboard Tools
export const queryBillboardsTool: ToolWithHandler = {
  name: "query_billboards",
  description: "Search and filter billboards",
  inputSchema: {
    type: "object",
    properties: {
      filterGroups: { type: "array" },
      sorting: { type: "object" },
      page: { type: "number" },
      pageSize: { type: "number" },
    },
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.QueryBillboards, args);
    const result = await ticketbeepApi.queryBillboards(
      validatedData as types.QueryBillboardsRequestBodyDto
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const queryBillboardCountByZipcodeTool: ToolWithHandler = {
  name: "query_billboard_count_by_zipcode",
  description: "Get billboard counts by zipcode",
  inputSchema: {
    type: "object",
    properties: {
      zipCodeFilterList: { type: "array" },
    },
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(
      schemas.QueryBillboardCountByZipcode,
      args
    );
    const result = await ticketbeepApi.queryBillboardCountByZipcode(
      validatedData as types.QueryRatedZipCodeListBillboardCountRequestBodyDto
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Analog Radio Tools
export const queryAnalogRadioTool: ToolWithHandler = {
  name: "query_analog_radio",
  description: "Search and filter analog radio stations",
  inputSchema: {
    type: "object",
    properties: {
      filterGroups: { type: "array" },
      sorting: { type: "object" },
      page: { type: "number" },
      pageSize: { type: "number" },
    },
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.QueryAnalogRadio, args);
    const result = await ticketbeepApi.queryAnalogRadio(
      validatedData as types.QueryAnalogRadioRequestBodyDto
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Dashboard Tools
export const getAverageTicketPriceTool: ToolWithHandler = {
  name: "get_average_ticket_price",
  description: "Get average ticket price data",
  inputSchema: {
    type: "object",
    properties: {
      year: { type: "number", description: "The year to filter by" },
    },
    required: ["year"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(
      schemas.GetAverageTicketPrice,
      args
    );
    const result = await ticketbeepApi.getAverageTicketPrice(
      validatedData.year
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getPromotersTool: ToolWithHandler = {
  name: "get_promoters",
  description: "Get promoter statistics",
  inputSchema: {
    type: "object",
    properties: {
      year: { type: "number", description: "The year to filter by" },
    },
    required: ["year"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetPromoters, args);
    const result = await ticketbeepApi.getPromoters(validatedData.year);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getTopCitiesTool: ToolWithHandler = {
  name: "get_top_cities",
  description: "Get top cities data",
  inputSchema: {
    type: "object",
    properties: {
      year: { type: "number", description: "The year to filter by" },
      slice: { type: "number", description: "The slice to filter by" },
    },
    required: ["year", "slice"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetTopCities, args);
    const result = await ticketbeepApi.getTopCities(
      validatedData.year,
      validatedData.slice
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getTopGenresTool: ToolWithHandler = {
  name: "get_top_genres",
  description: "Get top genres data",
  inputSchema: {
    type: "object",
    properties: {
      year: { type: "number", description: "The year to filter by" },
      slice: { type: "number", description: "The slice to filter by" },
    },
    required: ["year", "slice"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetTopGenres, args);
    const result = await ticketbeepApi.getTopGenres(
      validatedData.year,
      validatedData.slice
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getGrossRevenueTool: ToolWithHandler = {
  name: "get_gross_revenue",
  description: "Get gross revenue data",
  inputSchema: {
    type: "object",
    properties: {
      year: { type: "number", description: "The year to filter by" },
    },
    required: ["year"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetGrossRevenue, args);
    const result = await ticketbeepApi.getGrossRevenue(validatedData.year);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getTrafficShowsTool: ToolWithHandler = {
  name: "get_traffic_shows",
  description: "Get traffic shows data",
  inputSchema: {
    type: "object",
    properties: {
      year: { type: "number", description: "The year to filter by" },
    },
    required: ["year"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.GetTrafficShows, args);
    const result = await ticketbeepApi.getTrafficShows(validatedData.year);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Activity Tools
export const querySessionsTool: ToolWithHandler = {
  name: "query_sessions",
  description: "Query user activity sessions",
  inputSchema: {
    type: "object",
    properties: {
      sessionStartFilter: { type: "object" },
      sessionEndFilter: { type: "object" },
      userNameFilter: { type: "object" },
      userEmailFilter: { type: "object" },
      userIdFilter: { type: "object" },
      mediaPlanGeneratedCountFilter: { type: "object" },
      includeActions: { type: "boolean" },
      sorting: { type: "object" },
      page: { type: "number" },
      pageSize: { type: "number" },
    },
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.QuerySessions, args);
    const result = await ticketbeepApi.querySessions(
      validatedData as types.QuerySessionsRequestBodyDto
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const createSessionTool: ToolWithHandler = {
  name: "create_session",
  description: "Create a new activity session",
  inputSchema: {
    type: "object",
    properties: {
      authUserId: { type: "string", description: "The authenticated user ID" },
      activatedAt: { type: "number", description: "The activation timestamp" },
    },
    required: ["authUserId", "activatedAt"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.CreateSession, args);
    const result = await ticketbeepApi.createSession(validatedData);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const deactivateSessionTool: ToolWithHandler = {
  name: "deactivate_session",
  description: "Deactivate an activity session",
  inputSchema: {
    type: "object",
    properties: {
      sessionId: { type: "string", description: "The session ID" },
      deactivatedAt: {
        type: "number",
        description: "The deactivation timestamp",
      },
    },
    required: ["sessionId", "deactivatedAt"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.DeactivateSession, args);
    const result = await ticketbeepApi.deactivateSession(validatedData);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const queryActionsTool: ToolWithHandler = {
  name: "query_actions",
  description: "Query user actions",
  inputSchema: {
    type: "object",
    properties: {
      sessionIdFilter: { type: "object" },
      typeFilter: { type: "object" },
      sectionFilter: { type: "object" },
      page: { type: "number" },
      pageSize: { type: "number" },
    },
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.QueryActions, args);
    const result = await ticketbeepApi.queryActions(
      validatedData as types.QueryActionsRequestBodyDto
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const createActionTool: ToolWithHandler = {
  name: "create_action",
  description: "Create a new activity action",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string" },
      type: {
        type: "string",
        enum: [
          "session_start",
          "session_end",
          "media_plan_generated",
          "user_created",
          "user_updated",
          "user_deleted",
        ],
      },
      section: { type: "string", enum: ["auth", "admin", "media_plan"] },
      properties: { type: "object" },
      sessionId: { type: "string", description: "The session ID" },
    },
    required: ["type", "section", "sessionId"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(schemas.CreateAction, args);
    const result = await ticketbeepApi.createAction(validatedData);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Payment Tools
export const createStripeCheckoutTool: ToolWithHandler = {
  name: "create_stripe_checkout",
  description: "Create a Stripe checkout session",
  inputSchema: {
    type: "object",
    properties: {
      description: { type: "string", description: "Payment description" },
      userId: { type: "string", description: "User ID" },
      successUrl: { type: "string", description: "Success URL" },
      cancelUrl: { type: "string", description: "Cancel URL" },
      email: { type: "string", description: "User email" },
      quantity: { type: "number", description: "Quantity" },
    },
    required: [
      "description",
      "userId",
      "successUrl",
      "cancelUrl",
      "email",
      "quantity",
    ],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(
      schemas.CreateStripeCheckout,
      args
    );
    const result = await ticketbeepApi.createStripeCheckout(validatedData);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Auth Tools
export const checkUserVerificationTool: ToolWithHandler = {
  name: "check_user_verification",
  description: "Check if a user is verified",
  inputSchema: {
    type: "object",
    properties: {
      email: { type: "string", description: "User email" },
    },
    required: ["email"],
  },
  handler: async (args: any) => {
    const validatedData = validateWithZodSafe(
      schemas.CheckUserVerification,
      args
    );
    const result = await ticketbeepApi.checkUserVerification(
      validatedData.email
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Export all tools
export const tools: ToolWithHandler[] = [
  generateMediaPlanTool,
  searchArtistsTool,
  getArtistByIdTool,
  getArtistStatsTool,
  getArtistMetadataTool,
  scoreZipCodesTool,
  discoverEventsTool,
  discoverPlacesTool,
  getNearbyStatesTool,
  createCampaignTool,
  getCampaignsTool,
  getCampaignByIdTool,
  updateCampaignTool,
  deleteCampaignTool,
  queryBillboardsTool,
  queryBillboardCountByZipcodeTool,
  queryAnalogRadioTool,
  getAverageTicketPriceTool,
  getPromotersTool,
  getTopCitiesTool,
  getTopGenresTool,
  getGrossRevenueTool,
  getTrafficShowsTool,
  querySessionsTool,
  createSessionTool,
  deactivateSessionTool,
  queryActionsTool,
  createActionTool,
  createStripeCheckoutTool,
  checkUserVerificationTool,
];
