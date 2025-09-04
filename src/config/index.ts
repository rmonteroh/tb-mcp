import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface Config {
  ticketbeep: {
    apiBaseUrl: string;
  };
  mcp: {
    port: number;
  };
}

export const config: Config = {
  ticketbeep: {
    apiBaseUrl:
      process.env.TICKETBEEP_API_BASE_URL ||
      "https://ticketbeep-api-dev.up.railway.app",
  },
  mcp: {
    port: parseInt(process.env.PORT || "3001", 10),
  },
};

export default config;
