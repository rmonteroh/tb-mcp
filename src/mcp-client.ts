import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readline from "readline/promises";
import dotenv from "dotenv";
import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import { Tool } from "@modelcontextprotocol/sdk/types";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

export class MCPClient {
  private mcp: Client;
  private gemini: GoogleGenAI;
  private transport: StdioClientTransport | null = null;
  private tools: any[] = [];

  constructor() {
    this.gemini = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }
  // methods will go here
  async connectToServer(serverScriptPath: string) {
    try {
      const isJs = serverScriptPath.endsWith(".js");
      const isPy = serverScriptPath.endsWith(".py");
      if (!isJs && !isPy) {
        throw new Error("Server script must be a .js or .py file");
      }
      const command = isPy
        ? process.platform === "win32"
          ? "python"
          : "python3"
        : process.execPath;

      this.transport = new StdioClientTransport({
        command,
        args: [serverScriptPath],
      });
      await this.mcp.connect(this.transport);

      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        };
      });
      console.log(
        "Connected to server with tools:",
        this.tools.map(({ name }) => name)
      );
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  async processQuery(query: string) {
    const messages = [
      {
        role: "user",
        content: query,
      },
    ];

    const response: GenerateContentResponse =
      await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: messages,
      });

    const finalText = [];

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (typeof part === "string") {
          // Text response
          finalText.push(part);
        } else if (part.functionCall) {
          // Function call
          const toolName = part.functionCall.name;
          const toolArgs = part.functionCall.args as
            | { [x: string]: unknown }
            | undefined;

          const result = await this.mcp.callTool({
            name: toolName || "",
            arguments: toolArgs,
          });
          finalText.push(
            `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
          );

          messages.push({
            role: "user",
            content: result.content as string,
          });

          const followupResponse = await this.gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
          });

          if (followupResponse.candidates?.[0]?.content?.parts?.[0]) {
            finalText.push(
              typeof followupResponse.candidates[0].content.parts[0] ===
                "string"
                ? followupResponse.candidates[0].content.parts[0]
                : JSON.stringify(
                    followupResponse.candidates[0].content.parts[0]
                  )
            );
          }
        }
      }
    }

    return finalText.join("\n");
  }

  async chatLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      console.log("\nMCP Client Started!");
      console.log("Type your queries or 'quit' to exit.");

      while (true) {
        const message = await rl.question("\nQuery: ");
        if (message.trim().toLowerCase() === "quit") {
          break;
        }
        if (!message.trim()) {
          // If input is empty, prompt again
          continue;
        }
        const response = await this.processQuery(message);
        console.log("\n" + response);
      }
    } finally {
      rl.close();
    }
  }

  async cleanup() {
    await this.mcp.close();
  }
}
