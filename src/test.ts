import { ticketbeepApi } from "./services/ticketbeep-api.js";

async function testApiConnection() {
  try {
    console.log("Testing TicketBeep API connection...");

    // Test a simple endpoint - search for artists
    const result = await ticketbeepApi.searchArtists("test");
    console.log("API connection successful!");
    console.log("Sample response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("API connection failed:", error);
  }
}

testApiConnection();
