import { MCPClient } from "./mcp-client.js";

/* import { config } from "./config/index.js";
import { tools } from "./tools/index.js";
import { GoogleGenAI } from "@google/genai";

// MCP Client setup (pseudo, as actual MCP client SDK usage may vary)
// Replace with actual MCP client SDK if available
class McpClient {
  host: string;
  port: number;
  tools: any[];
  llm: any;

  constructor({
    host,
    port,
    tools,
    llm,
  }: {
    host: string;
    port: number;
    tools: any[];
    llm: any;
  }) {
    this.host = host;
    this.port = port;
    this.tools = tools;
    this.llm = llm;
  }

  async connect() {
    // Connect to MCP server (implement actual logic as needed)
    console.log(`Connecting to MCP server at ${this.host}:${this.port}...`);
    // ...
  }

  async runLLM(prompt: string) {
    // Gemini expects 'contents' to be a string or array of content objects
    const response = await this.llm.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response;
  }

  async invokeTool(toolName: string, args: any) {
    const tool = this.tools.find((t) => t.name === toolName);
    if (!tool) throw new Error(`Tool ${toolName} not found`);
    return tool.handler(args);
  }
}

// Instantiate Gemini LLM
const gemini = new GoogleGenAI({ apiKey: config.gemini.apiKey });

// Create MCP client
const mcpClient = new McpClient({
  host: config.mcp.host,
  port: config.mcp.port,
  tools,
  llm: gemini,
});

async function main() {
  await mcpClient.connect();

  // Example: Use Gemini LLM
  const prompt =
    "Give me a list of tools that i can use to generate a media plan";
  const response = await mcpClient.runLLM(prompt);
  console.log("Gemini LLM response:", response.text);

  // Example: Use an MCP tool
  // Replace with actual tool name and args as needed
  // const toolResult = await mcpClient.invokeTool("generate_media_plan", { ... });
  // console.log("Tool result:", toolResult);
}

main().catch((err) => {
  console.error("MCP Client error:", err);
});
 */

async function main() {
  if (process.argv.length < 3) {
    console.log("Usage: node index.ts <path_to_server_script>");
    return;
  }
  const mcpClient = new MCPClient();
  try {
    await mcpClient.connectToServer(process.argv[2]);
    await mcpClient.chatLoop();
  } finally {
    await mcpClient.cleanup();
    process.exit(0);
  }
}

main();
