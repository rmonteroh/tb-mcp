import { z } from "zod";

// Media Plan Schemas
export const MediaPlanConfigSchema = z.object({
  digital: z.boolean(),
  geo: z.boolean(),
  influencer: z.boolean(),
  ooh: z.boolean(),
  analog: z.boolean(),
});

export const GenerateMediaPlanSchema = z.object({
  artistId: z.string().min(1, "Artist ID is required"),
  venue: z.string().min(1, "Venue is required"),
  totalBudget: z.number().positive("Total budget must be positive"),
  startDate: z.string().datetime("Start date must be a valid ISO datetime"),
  endDate: z.string().datetime("End date must be a valid ISO datetime"),
  config: MediaPlanConfigSchema,
  campaignId: z.string().optional(),
});

export const SearchArtistsSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
});

export const GetArtistByIdSchema = z.object({
  id: z.string().min(1, "Artist ID is required"),
});

export const GetArtistStatsSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  artistId: z.string().min(1, "Artist ID is required"),
});

export const GetArtistMetadataSchema = z.object({
  id: z.string().min(1, "Artist ID is required"),
});

export const ArtistEthnicitySchema = z.object({
  code: z.string().min(1, "Ethnicity code is required"),
  name: z.string().min(1, "Ethnicity name is required"),
  weight: z.string().min(1, "Ethnicity weight is required"),
});

export const ScoreFiltersSchema = z.object({
  nationality: z.boolean(),
  ethnicity: z.boolean(),
  sales: z.boolean(),
  income: z.boolean(),
  customerSpending: z.boolean(),
});

export const ScoreZipCodesSchema = z.object({
  zipcodes: z.array(z.string().min(1, "Zipcode cannot be empty")),
  artistId: z.string().min(1, "Artist ID is required"),
  artistTotalFollowers: z
    .number()
    .nonnegative("Artist total followers must be non-negative"),
  ethnicity: ArtistEthnicitySchema,
  artistCountryCode: z.string().min(1, "Artist country code is required"),
  scoreFilters: ScoreFiltersSchema,
});

export const DiscoverEventsSchema = z.object({
  criteria: z.string().min(1, "Search criteria is required"),
});

export const DiscoverPlacesSchema = z.object({
  criteria: z.string().min(1, "Search criteria is required"),
});

export const GetNearbyStatesSchema = z.object({
  stateCode: z.string().min(1, "State code is required"),
  radius: z.number().positive("Radius must be positive"),
});

// Campaign Schemas
export const CreateCampaignSchema = z.object({
  artistId: z.string().min(1, "Artist ID is required"),
  venueId: z.string().min(1, "Venue ID is required"),
  phases: z.record(z.any()), // Complex object, will validate at runtime
  summary: z.record(z.any()), // Complex object, will validate at runtime
  configuration: z.record(z.any()), // Complex object, will validate at runtime
  userId: z.string().min(1, "User ID is required"),
});

export const GetCampaignByIdSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
});

export const UpdateCampaignSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
  artistId: z.string().optional(),
  venueId: z.string().optional(),
  phases: z.record(z.any()).optional(),
  summary: z.record(z.any()).optional(),
  configuration: z.record(z.any()).optional(),
  userId: z.string().optional(),
});

export const DeleteCampaignSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
});

// Billboard Schemas
export const QueryBillboardsSchema = z.object({
  filterGroups: z.array(z.any()).optional(),
  sorting: z.record(z.any()).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
});

export const QueryBillboardCountByZipcodeSchema = z.object({
  zipCodeFilterList: z.array(z.any()).optional(),
});

// Analog Radio Schemas
export const QueryAnalogRadioSchema = z.object({
  filterGroups: z.array(z.any()).optional(),
  sorting: z.record(z.any()).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
});

// Dashboard Schemas
export const GetAverageTicketPriceSchema = z.object({
  year: z.number().int().positive("Year must be a positive integer"),
});

export const GetPromotersSchema = z.object({
  year: z.number().int().positive("Year must be a positive integer"),
});

export const GetTopCitiesSchema = z.object({
  year: z.number().int().positive("Year must be a positive integer"),
  slice: z.number().int().positive("Slice must be a positive integer"),
});

export const GetTopGenresSchema = z.object({
  year: z.number().int().positive("Year must be a positive integer"),
  slice: z.number().int().positive("Slice must be a positive integer"),
});

export const GetGrossRevenueSchema = z.object({
  year: z.number().int().positive("Year must be a positive integer"),
});

export const GetTrafficShowsSchema = z.object({
  year: z.number().int().positive("Year must be a positive integer"),
});

// Activity Schemas
export const QuerySessionsSchema = z.object({
  sessionStartFilter: z.record(z.any()).optional(),
  sessionEndFilter: z.record(z.any()).optional(),
  userNameFilter: z.record(z.any()).optional(),
  userEmailFilter: z.record(z.any()).optional(),
  userIdFilter: z.record(z.any()).optional(),
  mediaPlanGeneratedCountFilter: z.record(z.any()).optional(),
  includeActions: z.boolean().optional(),
  sorting: z.record(z.any()).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
});

export const CreateSessionSchema = z.object({
  authUserId: z.string().min(1, "Auth user ID is required"),
  activatedAt: z
    .number()
    .int()
    .positive("Activated at must be a positive integer"),
});

export const DeactivateSessionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  deactivatedAt: z
    .number()
    .int()
    .positive("Deactivated at must be a positive integer"),
});

export const QueryActionsSchema = z.object({
  sessionIdFilter: z.record(z.any()).optional(),
  typeFilter: z.record(z.any()).optional(),
  sectionFilter: z.record(z.any()).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
});

export const CreateActionSchema = z.object({
  id: z.string().optional(),
  type: z.enum([
    "session_start",
    "session_end",
    "media_plan_generated",
    "user_created",
    "user_updated",
    "user_deleted",
  ]),
  section: z.enum(["auth", "admin", "media_plan"]),
  properties: z.record(z.any()).optional(),
  sessionId: z.string().min(1, "Session ID is required"),
});

// Payment Schemas
export const CreateStripeCheckoutSchema = z.object({
  description: z.string().min(1, "Description is required"),
  userId: z.string().min(1, "User ID is required"),
  successUrl: z.string().url("Success URL must be a valid URL"),
  cancelUrl: z.string().url("Cancel URL must be a valid URL"),
  email: z.string().email("Email must be a valid email address"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

// Auth Schemas
export const CheckUserVerificationSchema = z.object({
  email: z.string().email("Email must be a valid email address"),
});

// Export all schemas
export const schemas = {
  GenerateMediaPlan: GenerateMediaPlanSchema,
  SearchArtists: SearchArtistsSchema,
  GetArtistById: GetArtistByIdSchema,
  GetArtistStats: GetArtistStatsSchema,
  GetArtistMetadata: GetArtistMetadataSchema,
  ScoreZipCodes: ScoreZipCodesSchema,
  DiscoverEvents: DiscoverEventsSchema,
  DiscoverPlaces: DiscoverPlacesSchema,
  GetNearbyStates: GetNearbyStatesSchema,
  CreateCampaign: CreateCampaignSchema,
  GetCampaignById: GetCampaignByIdSchema,
  UpdateCampaign: UpdateCampaignSchema,
  DeleteCampaign: DeleteCampaignSchema,
  QueryBillboards: QueryBillboardsSchema,
  QueryBillboardCountByZipcode: QueryBillboardCountByZipcodeSchema,
  QueryAnalogRadio: QueryAnalogRadioSchema,
  GetAverageTicketPrice: GetAverageTicketPriceSchema,
  GetPromoters: GetPromotersSchema,
  GetTopCities: GetTopCitiesSchema,
  GetTopGenres: GetTopGenresSchema,
  GetGrossRevenue: GetGrossRevenueSchema,
  GetTrafficShows: GetTrafficShowsSchema,
  QuerySessions: QuerySessionsSchema,
  CreateSession: CreateSessionSchema,
  DeactivateSession: DeactivateSessionSchema,
  QueryActions: QueryActionsSchema,
  CreateAction: CreateActionSchema,
  CreateStripeCheckout: CreateStripeCheckoutSchema,
  CheckUserVerification: CheckUserVerificationSchema,
};
