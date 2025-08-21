import { z } from "zod";
import { ToolDefinition } from "./shared-tools.js";
import { ticketbeepApi } from "../services/ticketbeep-api.js";
import { filtersAvailableContext } from "../utils/filters-available.js";

// Media Plan Tools
/* export const generateMediaPlanTool: ToolDefinition = {
  name: "generate_media_plan",
  description:
    "Generate a comprehensive media plan for an artist's event. Requires artistId, venue, totalBudget, startDate, endDate, and config parameters.",
  inputSchema: {
    artistId: z.string().min(1, "Artist ID is required"),
    venue: z.string().min(1, "Venue is required"),
    totalBudget: z.number().min(1, "Total budget must be greater than 0"),
    startDate: z.string().min(1, "Start date is required (YYYY-MM-DD)"),
    endDate: z.string().min(1, "End date is required (YYYY-MM-DD)"),
    config: z.object({
      digital: z.boolean().default(true),
      geo: z.boolean().default(true),
      influencer: z.boolean().default(true),
      ooh: z.boolean().default(true),
      analog: z.boolean().default(true),
    }),
    campaignId: z.string().optional(),
  },
  handler: async ({
    artistId,
    venue,
    totalBudget,
    startDate,
    endDate,
    config,
    campaignId,
  }) => {
    const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

    const result = await ticketbeepApi.generateMediaPlan({
      artistId,
      venue,
      totalBudget,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      config,
      campaignId,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
}; */

// Artist Tools
export const searchArtistsTool: ToolDefinition = {
  name: "search_artists",
  description:
    "Search for artists by name. Returns a list of matching artists with their IDs.",
  inputSchema: {
    name: z.string().min(1, "Artist name is required"),
  },
  handler: async ({ name }) => {
    const result = await ticketbeepApi.searchArtists(name);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getArtistByIdTool: ToolDefinition = {
  name: "get_artist_by_id",
  description:
    "Get detailed artist information by ID including metadata and statistics.",
  inputSchema: {
    id: z.string().min(1, "Artist ID is required"),
  },
  handler: async ({ id }) => {
    const result = await ticketbeepApi.getArtistById(id);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getArtistStatsTool: ToolDefinition = {
  name: "get_artist_stats",
  description:
    "Get artist statistics and analytics data for a specific social media platform.",
  inputSchema: {
    domain: z
      .enum(["instagram", "tiktok", "youtube"])
      .describe("The social media platform of the artist"),
    artistId: z.string().min(1, "Artist ID is required"),
  },
  handler: async ({ domain, artistId }) => {
    const result = await ticketbeepApi.getArtistStats(domain, artistId);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getArtistMetadataTool: ToolDefinition = {
  name: "get_artist_metadata",
  description:
    "Get comprehensive artist metadata including career information and demographics.",
  inputSchema: {
    id: z.string().min(1, "Artist ID is required"),
  },
  handler: async ({ id }) => {
    const result = await ticketbeepApi.getArtistMetadata(id);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Geographic Tools
/* export const scoreZipCodesTool: ToolDefinition = {
  name: "score_zipcodes",
  description: "Score zipcodes based on artist demographics and market data.",
  inputSchema: {
    zipcodes: z.array(z.string()).min(1, "At least one zipcode is required"),
    artistId: z.string().min(1, "Artist ID is required"),
    artistTotalFollowers: z
      .number()
      .min(0, "Follower count must be non-negative"),
    ethnicity: z.object({
      code: z.string().min(1, "Ethnicity code is required"),
      name: z.string().min(1, "Ethnicity name is required"),
      weight: z.string().min(1, "Weight is required"),
    }),
    artistCountryCode: z.string().min(1, "Country code is required"),
    scoreFilters: z.object({
      nationality: z.boolean(),
      ethnicity: z.boolean(),
      sales: z.boolean(),
      income: z.boolean(),
      customerSpending: z.boolean(),
    }),
  },
  handler: async (data) => {
    const result = await ticketbeepApi.scoreZipCodes(data);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
}; */

/* export const getNearbyStatesTool: ToolDefinition = {
  name: "get_nearby_states",
  description:
    "Get nearby states within a specified radius from a given state.",
  inputSchema: {
    stateCode: z.string().min(1, "State code is required"),
    radius: z.number().min(0, "Radius must be non-negative"),
  },
  handler: async ({ stateCode, radius }) => {
    const result = await ticketbeepApi.getNearbyStates(stateCode, radius);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
}; */

// Discovery Tools
/* export const discoverEventsTool: ToolDefinition = {
  name: "discover_events",
  description:
    "Find events in a specific area and time range using search criteria.",
  inputSchema: {
    criteria: z.string().min(1, "Search criteria JSON string is required"),
  },
  handler: async ({ criteria }) => {
    const result = await ticketbeepApi.discoverEvents(criteria);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
}; */

/* export const discoverPlacesTool: ToolDefinition = {
  name: "discover_places",
  description:
    "Search for places using Google Places API with custom criteria.",
  inputSchema: {
    criteria: z.string().min(1, "Search criteria JSON string is required"),
  },
  handler: async ({ criteria }) => {
    const result = await ticketbeepApi.discoverPlaces(criteria);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
}; */

// Campaign Management Tools
/* export const createCampaignTool: ToolDefinition = {
  name: "create_campaign",
  description: "Create a new marketing campaign with phases and configuration.",
  inputSchema: {
    artistId: z.string().min(1, "Artist ID is required"),
    venueId: z.string().min(1, "Venue ID is required"),
    phases: z.record(z.any()),
    summary: z.record(z.any()),
    configuration: z.record(z.any()),
    userId: z.string().min(1, "User ID is required"),
  },
  handler: async (data) => {
    await ticketbeepApi.createCampaign(data);
    return {
      content: [{ type: "text", text: "Campaign created successfully" }],
    };
  },
}; */

export const getCampaignsTool: ToolDefinition = {
  name: "get_campaigns",
  description: `
  Retrieve a paginated list of marketing campaigns with filtering and sorting options. Supports sorting by created and updated, and filtering by artist_id/venue_id using the format (artist_id = "308" || venue_id = "7ux7vmx7exeq29x"), and pagination controls. Example query parameters: sort=created (sort by created date), filter=(artist_id = '308') (filter by artist id, we use the id of the artist, not the name), perPage=50 (results per page), page=1 (page number).
  `,
  inputSchema: {
    page: z
      .number()
      .min(1, "Page number for pagination (starts from 1)")
      .default(1),
    perPage: z
      .number()
      .min(1, "Page size must be greater than 0")
      .max(100, "Page size must be less than 100")
      .default(10),
    filter: z.string().optional(),
    sort: z.string().optional().default("name"),
  },
  handler: async ({ page, perPage, filter, sort }) => {
    const result = await ticketbeepApi.getCampaigns(
      page,
      perPage,
      filter,
      sort
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getCampaignByIdTool: ToolDefinition = {
  name: "get_campaign_by_id",
  description: "Get a specific campaign by its ID.",
  inputSchema: {
    id: z.string().min(1, "Campaign ID is required"),
  },
  handler: async ({ id }) => {
    const result = await ticketbeepApi.getCampaignById(id);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

/* export const updateCampaignTool: ToolDefinition = {
  name: "update_campaign",
  description: "Update an existing campaign with new data.",
  inputSchema: {
    id: z.string().min(1, "Campaign ID is required"),
    artistId: z.string().optional(),
    venueId: z.string().optional(),
    phases: z.record(z.any()).optional(),
    summary: z.record(z.any()).optional(),
    configuration: z.record(z.any()).optional(),
    userId: z.string().optional(),
  },
  handler: async ({ id, ...data }) => {
    await ticketbeepApi.updateCampaign(id, data);
    return {
      content: [{ type: "text", text: "Campaign updated successfully" }],
    };
  },
}; */

/* export const deleteCampaignTool: ToolDefinition = {
  name: "delete_campaign",
  description: "Delete a campaign by its ID.",
  inputSchema: {
    id: z.string().min(1, "Campaign ID is required"),
  },
  handler: async ({ id }) => {
    await ticketbeepApi.deleteCampaign(id);
    return {
      content: [{ type: "text", text: "Campaign deleted successfully" }],
    };
  },
}; */

// Billboard Tools
/* export const queryBillboardsTool: ToolDefinition = {
  name: "query_billboards",
  description: "Search and filter billboard inventory with custom criteria.",
  inputSchema: {
    filterGroups: z.array(z.any()).optional(),
    sorting: z.record(z.any()).optional(),
    page: z.number().min(1).optional(),
    pageSize: z.number().min(1).max(100).optional(),
  },
  handler: async (data) => {
    const result = await ticketbeepApi.queryBillboards(data);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
}; */

/* export const queryBillboardCountByZipcodeTool: ToolDefinition = {
  name: "query_billboard_count_by_zipcode",
  description: "Get billboard counts grouped by zipcode areas.",
  inputSchema: {
    zipCodeFilterList: z.array(z.any()).optional(),
  },
  handler: async (data) => {
    const result = await ticketbeepApi.queryBillboardCountByZipcode(data);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
}; */

// Analog Radio Tools
/* export const queryAnalogRadioTool: ToolDefinition = {
  name: "query_analog_radio",
  description: "Search and filter analog radio stations with custom criteria.",
  inputSchema: {
    filterGroups: z.array(z.any()).optional(),
    sorting: z.record(z.any()).optional(),
    page: z.number().min(1).optional(),
    pageSize: z.number().min(1).max(100).optional(),
  },
  handler: async (data) => {
    const result = await ticketbeepApi.queryAnalogRadio(data);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
}; */

// Dashboard Analytics Tools
export const getAverageTicketPriceTool: ToolDefinition = {
  name: "get_average_ticket_price",
  description: "Get average ticket price analytics for a specific year.",
  inputSchema: {
    year: z.number().min(2000).max(2100, "Year must be between 2000 and 2100"),
  },
  handler: async ({ year }) => {
    const result = await ticketbeepApi.getAverageTicketPrice(year);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getPromotersTool: ToolDefinition = {
  name: "get_promoters",
  description:
    "Get promoter statistics and performance data for a specific year.",
  inputSchema: {
    year: z.number().min(2000).max(2100, "Year must be between 2000 and 2100"),
  },
  handler: async ({ year }) => {
    const result = await ticketbeepApi.getPromoters(year);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getTopCitiesTool: ToolDefinition = {
  name: "get_top_cities",
  description: "Get top performing cities data with optional slice filtering.",
  inputSchema: {
    year: z.number().min(2000).max(2100, "Year must be between 2000 and 2100"),
    slice: z.number().min(1, "Slice must be greater than 0"),
  },
  handler: async ({ year, slice }) => {
    const result = await ticketbeepApi.getTopCities(year, slice);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getTopGenresTool: ToolDefinition = {
  name: "get_top_genres",
  description:
    "Get top performing music genres data with optional slice filtering.",
  inputSchema: {
    year: z.number().min(2000).max(2100, "Year must be between 2000 and 2100"),
    slice: z.number().min(1, "Slice must be greater than 0"),
  },
  handler: async ({ year, slice }) => {
    const result = await ticketbeepApi.getTopGenres(year, slice);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getGrossRevenueTool: ToolDefinition = {
  name: "get_gross_revenue",
  description: "Get gross revenue analytics for a specific year.",
  inputSchema: {
    year: z.number().min(2000).max(2100, "Year must be between 2000 and 2100"),
  },
  handler: async ({ year }) => {
    const result = await ticketbeepApi.getGrossRevenue(year);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

export const getTrafficShowsTool: ToolDefinition = {
  name: "get_traffic_shows",
  description: "Get traffic and show attendance analytics for a specific year.",
  inputSchema: {
    year: z.number().min(2000).max(2100, "Year must be between 2000 and 2100"),
  },
  handler: async ({ year }) => {
    const result = await ticketbeepApi.getTrafficShows(year);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Authentication Tools
export const checkUserVerificationTool: ToolDefinition = {
  name: "check_user_verification",
  description: "Check if a user account is verified by email.",
  inputSchema: {
    email: z.string().email("Valid email is required"),
  },
  handler: async ({ email }) => {
    const result = await ticketbeepApi.checkUserVerification(email);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Talent Buyers Tools
export const getTalentBuyersTool: ToolDefinition = {
  name: "get_talent_buyers",
  description: `Retrieve a paginated list of talent buyers with filtering and sorting options. Supports sorting by name, filtering by name/address/type using the format (name ~ "miami" || address ~ "miami" || type ~ "miami"), and pagination controls. Example query parameters: sort=name (sort by name), filter=(name ~ 'miami') (filter by miami in name), perPage=50 (results per page), page=1 (page number).`,
  inputSchema: {
    page: z.number().min(1, "Page must be greater than 0").default(1),
    perPage: z
      .number()
      .min(1, "Page size must be greater than 0")
      .max(100, "Page size must be less than 100")
      .default(10),
    filter: z.string().optional(),
    sort: z.string().optional().default("name"),
  },
  handler: async ({ page, perPage, filter, sort }) => {
    const result = await ticketbeepApi.getTalentBuyers(
      page,
      perPage,
      filter,
      sort
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
};

// Export all tools grouped by category
export const mediaTools = [
  /* generateMediaPlanTool */
];
export const artistTools = [
  searchArtistsTool,
  getArtistByIdTool,
  getArtistStatsTool,
  getArtistMetadataTool,
];
// export const geographicTools = [scoreZipCodesTool, getNearbyStatesTool];
// export const discoveryTools = [discoverEventsTool, discoverPlacesTool];
export const campaignTools = [
  // createCampaignTool,
  getCampaignsTool,
  getCampaignByIdTool,
  // updateCampaignTool,
  // deleteCampaignTool,
];
export const billboardTools = [
  // queryBillboardsTool,
  // queryBillboardCountByZipcodeTool,
];
// export const radioTools = [queryAnalogRadioTool];
export const analyticsTools = [
  getAverageTicketPriceTool,
  getPromotersTool,
  getTopCitiesTool,
  getTopGenresTool,
  getGrossRevenueTool,
  getTrafficShowsTool,
];
export const activityTools = [
  // querySessionsTool,
  // createSessionTool,
  // deactivateSessionTool,
  // queryActionsTool,
  // createActionTool,
];
// export const paymentTools = [createStripeCheckoutTool];
export const authTools = [checkUserVerificationTool];

// Export all tools as a single array
export const allTools: ToolDefinition[] = [
  // ...mediaTools,
  ...artistTools,
  // ...geographicTools,
  // ...discoveryTools,
  ...campaignTools,
  ...billboardTools,
  // ...radioTools,
  ...analyticsTools,
  ...activityTools,
  // ...paymentTools,
  ...authTools,
  getTalentBuyersTool,
];
