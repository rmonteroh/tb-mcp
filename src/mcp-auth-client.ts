import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { 
  CallToolResultSchema, 
  ListToolsResultSchema,
  ListResourcesResultSchema,
  ListPromptsResultSchema 
} from "@modelcontextprotocol/sdk/types.js";

export interface McpAuthClientOptions {
  serverUrl: string;
  bearerToken?: string;
  name?: string;
  version?: string;
}

export class McpAuthClient {
  private client: Client | null = null;
  private transport: StreamableHTTPClientTransport | null = null;
  private options: McpAuthClientOptions;

  constructor(options: McpAuthClientOptions) {
    this.options = {
      name: 'ticketbeep-mcp-auth-client',
      version: '1.0.0',
      ...options
    };
  }

  async connect(): Promise<void> {
    if (this.client && this.transport) {
      throw new Error('Already connected. Disconnect first.');
    }

    console.log(`Connecting to ${this.options.serverUrl}...`);

    try {
      // Create the client
      this.client = new Client({
        name: this.options.name!,
        version: this.options.version!
      });

      // Set error handler
      this.client.onerror = (error) => {
        console.error('MCP Client error:', error);
      };

      // Prepare request init with authentication headers
      const requestInit: RequestInit = {
        headers: {}
      };

      if (this.options.bearerToken) {
        (requestInit.headers as Record<string, string>)['Authorization'] = `Bearer ${this.options.bearerToken}`;
      }

      // Create transport with authentication
      this.transport = new StreamableHTTPClientTransport(
        new URL(this.options.serverUrl),
        {
          requestInit
        }
      );

      // Connect the client
      await this.client.connect(this.transport);

      console.log('✅ Connected to MCP server');
      console.log(`Session ID: ${this.transport.sessionId}`);
      
      // Log server info
      const serverInfo = this.client.getServerVersion();
      if (serverInfo) {
        console.log(`Server: ${serverInfo.name} v${serverInfo.version}`);
      }

      const capabilities = this.client.getServerCapabilities();
      if (capabilities) {
        console.log('Server capabilities:', Object.keys(capabilities).filter(key => capabilities[key as keyof typeof capabilities]));
      }

    } catch (error) {
      console.error('❌ Failed to connect:', error);
      this.client = null;
      this.transport = null;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.client || !this.transport) {
      console.log('Not connected.');
      return;
    }

    try {
      await this.transport.close();
      console.log('✅ Disconnected from MCP server');
      this.client = null;
      this.transport = null;
    } catch (error) {
      console.error('❌ Error disconnecting:', error);
      throw error;
    }
  }

  setBearerToken(token: string): void {
    this.options.bearerToken = token;
    
    // If already connected, we need to reconnect with the new token
    if (this.client && this.transport) {
      console.log('⚠️  Token updated. You may need to reconnect for the new token to take effect.');
    }
  }

  async listTools(): Promise<any> {
    this.assertConnected();

    try {
      const result = await this.client!.request({
        method: 'tools/list',
        params: {}
      }, ListToolsResultSchema);

      console.log(`📋 Found ${result.tools.length} tools:`);
      result.tools.forEach(tool => {
        console.log(`  • ${tool.name}: ${tool.description || 'No description'}`);
      });

      return result;
    } catch (error) {
      console.error('❌ Error listing tools:', error);
      throw error;
    }
  }

  async callTool(name: string, args: any = {}): Promise<any> {
    this.assertConnected();

    try {
      console.log(`🔧 Calling tool '${name}' with args:`, args);
      
      const result = await this.client!.request({
        method: 'tools/call',
        params: {
          name,
          arguments: args
        }
      }, CallToolResultSchema);

      console.log('📄 Tool result:');
      result.content.forEach((item, index) => {
        if (item.type === 'text') {
          console.log(`  [${index + 1}] ${item.text}`);
        } else {
          console.log(`  [${index + 1}] ${item.type} content:`, item);
        }
      });

      return result;
    } catch (error) {
      console.error(`❌ Error calling tool '${name}':`, error);
      throw error;
    }
  }

  async listResources(): Promise<any> {
    this.assertConnected();

    try {
      const result = await this.client!.request({
        method: 'resources/list',
        params: {}
      }, ListResourcesResultSchema);

      console.log(`📁 Found ${result.resources.length} resources:`);
      result.resources.forEach(resource => {
        console.log(`  • ${resource.name}: ${resource.uri}`);
      });

      return result;
    } catch (error) {
      console.error('❌ Error listing resources:', error);
      throw error;
    }
  }

  async listPrompts(): Promise<any> {
    this.assertConnected();

    try {
      const result = await this.client!.request({
        method: 'prompts/list',
        params: {}
      }, ListPromptsResultSchema);

      console.log(`💬 Found ${result.prompts.length} prompts:`);
      result.prompts.forEach(prompt => {
        console.log(`  • ${prompt.name}: ${prompt.description || 'No description'}`);
      });

      return result;
    } catch (error) {
      console.error('❌ Error listing prompts:', error);
      throw error;
    }
  }

  async ping(): Promise<any> {
    this.assertConnected();

    try {
      const result = await this.client!.ping();
      console.log('🏓 Ping successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Ping failed:', error);
      throw error;
    }
  }

  getSessionId(): string | undefined {
    return this.transport?.sessionId;
  }

  isConnected(): boolean {
    return this.client !== null && this.transport !== null;
  }

  private assertConnected(): void {
    if (!this.client || !this.transport) {
      throw new Error('Not connected to MCP server. Call connect() first.');
    }
  }
}

// Convenience function to create and connect a client
export async function createMcpAuthClient(options: McpAuthClientOptions): Promise<McpAuthClient> {
  const client = new McpAuthClient(options);
  await client.connect();
  return client;
}