import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { config } from "../config/index.js";
import * as types from "../types/index.js";

export class TicketBeepApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.ticketbeep.apiBaseUrl,
      timeout: 300000,
      headers: {
        "Content-Type": "application/json",
        Referer: "https://dev-app.ticketbeep.com",
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use((config) => {
      /* if (this.config.ticketbeep.apiKey) {
        config.headers["ACCESS-KEY"] = this.config.ticketbeep.apiKey;
      } */
      if (this.config.ticketbeep.apiKey) {
        config.headers["tb-access-key"] = this.config.ticketbeep.apiKey;
      }
      /* const authToken = await this.getAuthorizationToken();
      console.log("authToken", authToken);
      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken.token}`;
      } */
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  private get config() {
    return config;
  }

  // Media Plan Endpoints
  async generateMediaPlan(
    data: types.GenerateMediaPlanDto
  ): Promise<types.CampaignResponse> {
    const response = await this.client.post("/api/media-plan/generate", data);
    return response.data;
  }

  async searchArtists(name?: string): Promise<types.ArtistSearchResponse> {
    try {
      // const authToken = await this.getAuthorizationToken();
      // console.log("authToken", authToken);
      // console.log("headers", this.config.ticketbeep.apiKey);
      const params = name ? { name } : {};
      const response = await this.client.get("/api/media-plan/artists", {
        params,
        // headers: {
        //   Authorization: `Bearer ${authToken.token}`,
        // },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching artists:", error);
      throw error;
    }
  }

  async getArtistById(id: string): Promise<types.ArtistByIdResponse> {
    const response = await this.client.get(`/api/media-plan/artist/${id}`);
    return response.data;
  }

  async getArtistStats(
    domain: string,
    artistId: string
  ): Promise<types.ArtistStatsData> {
    const response = await this.client.get("/api/media-plan/artist-stats", {
      params: { domain, artistId },
    });
    return response.data;
  }

  async getArtistMetadata(id: string): Promise<types.ArtistMetadata> {
    const response = await this.client.get(
      `/api/media-plan/artist-metadata/${id}`
    );
    return response.data;
  }

  async scoreZipCodes(
    data: types.ScoreZipCodesDto
  ): Promise<types.ScoreZipCodesData[]> {
    const response = await this.client.post(
      "/api/media-plan/score-zipcodes",
      data
    );
    return response.data;
  }

  async discoverEvents(
    criteria: string
  ): Promise<types.EventsDiscoverResponse> {
    const response = await this.client.get("/api/media-plan/events/discover", {
      params: { criteria },
    });
    return response.data;
  }

  async discoverPlaces(criteria: string): Promise<types.GooglePlaceDto[]> {
    const response = await this.client.get("/api/media-plan/places/discover", {
      params: { criteria },
    });
    return response.data;
  }

  async getNearbyStates(stateCode: string, radius: number): Promise<string[]> {
    const response = await this.client.get(
      `/api/media-plan/state/${stateCode}/nearby/${radius}`
    );
    return response.data;
  }

  // Billboard Endpoints
  async queryBillboards(
    data: types.QueryBillboardsRequestBodyDto
  ): Promise<types.QueryBillboardsResponseContentDto> {
    const response = await this.client.post(
      "/api/media-plan/billboards/query",
      data
    );
    return response.data;
  }

  async queryBillboardCountByZipcode(
    data: types.QueryRatedZipCodeListBillboardCountRequestBodyDto
  ): Promise<types.QueryRatedZipCodeListBillboardCountResponseContentDto> {
    const response = await this.client.post(
      "/api/media-plan/billboards/rated-zipcode-list/count/query",
      data
    );
    return response.data;
  }

  // Analog Radio Endpoints
  async queryAnalogRadio(
    data: types.QueryAnalogRadioRequestBodyDto
  ): Promise<types.QueryAnalogRadioResponseContentDto> {
    const response = await this.client.post(
      "/api/media-plan/analog-radio/query",
      data
    );
    return response.data;
  }

  // Campaign Endpoints
  async createCampaign(data: types.CreateCampaignDto): Promise<void> {
    await this.client.post("/api/campaign", data);
  }

  async getCampaigns(): Promise<
    { items: types.Campaign[] } & types.ListResponse
  > {
    const response = await this.client.get("/api/campaign");
    return response.data;
  }

  async getCampaignById(id: string): Promise<types.Campaign> {
    const response = await this.client.get(`/api/campaign/${id}`);
    return response.data;
  }

  async updateCampaign(
    id: string,
    data: types.UpdateCampaignDto
  ): Promise<void> {
    await this.client.patch(`/api/campaign/${id}`, data);
  }

  async deleteCampaign(id: string): Promise<void> {
    await this.client.delete(`/api/campaign/${id}`);
  }

  // Dashboard Endpoints
  async getAverageTicketPrice(
    year: number
  ): Promise<types.QueryDashboardAverageTicketPriceResponseContentDto> {
    const response = await this.client.get(
      "/api/dashboard/average-ticket-price",
      {
        params: { year },
      }
    );
    return response.data;
  }

  async getPromoters(
    year: number
  ): Promise<types.QueryDashboardPromoterResponseContentDto> {
    const response = await this.client.get("/api/dashboard/promoters", {
      params: { year },
    });
    return response.data;
  }

  async getTopCities(
    year: number,
    slice: number
  ): Promise<types.QueryDashboardTopCitiesResponseContentDto> {
    const response = await this.client.get("/api/dashboard/top-cities", {
      params: { year, slice },
    });
    return response.data;
  }

  async getTopGenres(
    year: number,
    slice: number
  ): Promise<types.QueryDashboardTopGenresResponseContentDto> {
    const response = await this.client.get("/api/dashboard/top-genres", {
      params: { year, slice },
    });
    return response.data;
  }

  async getGrossRevenue(
    year: number
  ): Promise<types.QueryDashboardGrossRevenueResponseContentDto> {
    const response = await this.client.get("/api/dashboard/gross-revenue", {
      params: { year },
    });
    return response.data;
  }

  async getTrafficShows(
    year: number
  ): Promise<types.QueryDashboardTrafficShowsResponseContentDto> {
    const response = await this.client.get("/api/dashboard/traffic-shows", {
      params: { year },
    });
    return response.data;
  }

  // Activity Endpoints
  async querySessions(
    data: types.QuerySessionsRequestBodyDto
  ): Promise<types.QuerySessionsResponseContentDto> {
    const response = await this.client.post(
      "/api/activity/sessions/query",
      data
    );
    return response.data;
  }

  async createSession(
    data: types.CreateSessionRequestBodyDto
  ): Promise<types.CreateSessionResponseContentDto> {
    const response = await this.client.post("/api/activity/sessions", data);
    return response.data;
  }

  async deactivateSession(
    data: types.DeactivateSessionRequestBodyDto
  ): Promise<types.DeactivateSessionResponseContentDto> {
    const response = await this.client.put(
      "/api/activity/sessions/deactivate",
      data
    );
    return response.data;
  }

  async queryActions(
    data: types.QueryActionsRequestBodyDto
  ): Promise<types.QueryActionsResponseContentDto> {
    const response = await this.client.post(
      "/api/activity/actions/query",
      data
    );
    return response.data;
  }

  async createAction(
    data: types.CreateActionRequestBodyDto
  ): Promise<types.CreateActionResponseContentDto> {
    const response = await this.client.post("/api/activity/actions", data);
    return response.data;
  }

  // Payment Endpoints
  async createStripeCheckout(
    data: types.CreateStripePaymentDto
  ): Promise<types.StripePaymentSessionResponse> {
    const response = await this.client.post(
      "/api/payment/stripe/create-checkout-session",
      data
    );
    return response.data;
  }

  // Auth Endpoints
  async checkUserVerification(
    email: string
  ): Promise<types.UserVerificationResponse> {
    const response = await this.client.get(
      "/api/auth/check-user-verification",
      {
        params: { email },
      }
    );
    return response.data;
  }

  // Talent Buyers Endpoints
  async getTalentBuyers(
    page: number,
    perPage: number,
    filter: string,
    sort: string
  ) {
    const response = await this.client.get("/api/talent-buyers", {
      params: { page, perPage, filter, sort },
    });
    return response.data;
  }
}

export const ticketbeepApi = new TicketBeepApiService();
