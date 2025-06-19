import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface Config {
  ticketbeep: {
    apiBaseUrl: string;
    apiKey?: string;
    authToken?: string;
  };
  mcp: {
    port: number;
    host: string;
  };
  gemini: {
    apiKey: string;
  };
}

export const config: Config = {
  ticketbeep: {
    apiBaseUrl:
      process.env.TICKETBEEP_API_BASE_URL ||
      "https://ticketbeep-api-dev.up.railway.app",
    apiKey: process.env.TICKETBEEP_API_KEY,
    authToken: process.env.TICKETBEEP_AUTH_TOKEN,
  },
  mcp: {
    port: parseInt(process.env.MCP_SERVER_PORT || "3000", 10),
    host: process.env.MCP_SERVER_HOST || "localhost",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
  },
};

export default config;
