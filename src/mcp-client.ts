import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readline from "readline/promises";
import dotenv from "dotenv";
import { GoogleGenAI, FunctionCallingConfigMode } from "@google/genai";

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
        parts: [{ text: query }],
      },
    ];

    // Convert MCP tools to Gemini function declarations
    const geminiTools = [
      {
        functionDeclarations: this.tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          parameters: tool.input_schema,
        })),
      },
    ];

    const config = {
      tools: geminiTools,
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.AUTO,
        },
      },
    };

    let response = await this.gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      config,
    });

    // console.log("Gemini raw response:", JSON.stringify(response, null, 2));

    let finalText = [];
    let loopCount = 0;
    const maxLoops = 5;
    while (loopCount++ < maxLoops) {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (!part) break;

      if (typeof part === "string") {
        finalText.push(part);
        break;
      } else if (part.functionCall) {
        // Function call
        const toolName = part.functionCall.name;
        const toolArgs = part.functionCall.args as
          | { [x: string]: unknown }
          | undefined;

        console.log("Calling tool:", toolName, toolArgs);
        const result = await this.mcp.callTool({
          name: toolName || "",
          arguments: toolArgs,
        });
        let toolResponseContent: any = result.content;
        if (typeof toolResponseContent === "string") {
          try {
            toolResponseContent = JSON.parse(toolResponseContent);
          } catch {}
        }
        // Ensure toolResponseContent is a plain object
        if (
          typeof toolResponseContent !== "object" ||
          toolResponseContent === null ||
          Array.isArray(toolResponseContent)
        ) {
          toolResponseContent = { result: toolResponseContent };
        }
        console.log(
          "Tool response:",
          JSON.stringify(toolResponseContent, null, 2)
        );
        messages.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name: toolName,
                response: toolResponseContent,
              },
            } as any,
          ],
        });
        response = await this.gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: messages,
          config,
        });
      } else {
        // Unknown part type, print as JSON for debugging
        finalText.push(JSON.stringify(part));
        break;
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
          continue;
        }
        try {
          const response = await this.processQuery(message);
          if (!response) {
            console.log("\n[No response received from Gemini or tool]");
          } else {
            console.log("\n" + response);
          }
        } catch (err) {
          console.error("\n[Error processing query]:", err);
        }
      }
    } finally {
      rl.close();
    }
  }

  async cleanup() {
    await this.mcp.close();
  }
}
