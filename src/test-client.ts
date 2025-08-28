import axios, { AxiosResponse } from 'axios';

export interface McpRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

export interface McpResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export class McpTestClient {
  private baseUrl: string;
  private bearerToken?: string;

  constructor(baseUrl: string, bearerToken?: string) {
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
  }

  setBearerToken(token: string) {
    this.bearerToken = token;
  }

  async sendRequest(method: string, params?: any): Promise<McpResponse> {
    const request: McpRequest = {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.bearerToken) {
      headers.Authorization = `Bearer ${this.bearerToken}`;
    }

    try {
      const response: AxiosResponse<McpResponse> = await axios.post(
        `${this.baseUrl}/mcp`,
        request,
        { headers }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw error;
    }
  }

  // Convenience methods for common MCP operations
  async initialize(capabilities: any = {}) {
    return this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities,
      clientInfo: {
        name: 'ticketbeep-test-client',
        version: '1.0.0'
      }
    });
  }

  async listTools() {
    return this.sendRequest('tools/list');
  }

  async callTool(name: string, arguments_: any) {
    return this.sendRequest('tools/call', {
      name,
      arguments: arguments_
    });
  }

  async listResources() {
    return this.sendRequest('resources/list');
  }

  async readResource(uri: string) {
    return this.sendRequest('resources/read', { uri });
  }
}

// Example usage function
export async function runTestScenarios() {
  const client = new McpTestClient('http://localhost:3001');
  
  console.log('=== Testing without Bearer token ===');
  try {
    const initResponse = await client.initialize();
    console.log('Initialize response:', JSON.stringify(initResponse, null, 2));
  } catch (error) {
    console.error('Error without token:', error);
  }

  console.log('\n=== Testing with Bearer token ===');
  client.setBearerToken('test-token-123');
  
  try {
    const initResponse = await client.initialize();
    console.log('Initialize response:', JSON.stringify(initResponse, null, 2));
    
    const toolsResponse = await client.listTools();
    console.log('Tools response:', JSON.stringify(toolsResponse, null, 2));
    
    // Test a tool call
    const searchResponse = await client.callTool('search_artists', {
      query: 'taylor swift',
      limit: 5
    });
    console.log('Search response:', JSON.stringify(searchResponse, null, 2));
    
  } catch (error) {
    console.error('Error with token:', error);
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  runTestScenarios().catch(console.error);
}