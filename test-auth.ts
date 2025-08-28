#!/usr/bin/env tsx

import { McpTestClient } from './src/test-client.js';

async function main() {
  const serverUrl = process.env.MCP_SERVER_URL || 'http://localhost:3001';
  
  console.log(`Testing MCP server at: ${serverUrl}\n`);

  // Test 1: Request without authentication (should fail)
  console.log('=== Test 1: Request without Bearer token ===');
  const clientNoAuth = new McpTestClient(serverUrl);
  try {
    const response = await clientNoAuth.initialize();
    console.log('❌ Unexpected success:', JSON.stringify(response, null, 2));
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly rejected: 401 Unauthorized');
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }

  // Test 2: Request with invalid token (should fail)
  console.log('\n=== Test 2: Request with invalid Bearer token ===');
  const clientBadAuth = new McpTestClient(serverUrl, 'invalid-token-xyz');
  try {
    const response = await clientBadAuth.initialize();
    console.log('❌ Unexpected success:', JSON.stringify(response, null, 2));
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly rejected: 401 Unauthorized');
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }

  // Test 3: Request with valid token (should succeed)
  console.log('\n=== Test 3: Request with valid Bearer token ===');
  const clientGoodAuth = new McpTestClient(serverUrl, 'test-token-123');
  try {
    const initResponse = await clientGoodAuth.initialize();
    console.log('✅ Initialize successful:', JSON.stringify(initResponse, null, 2));

    // Test listing tools
    const toolsResponse = await clientGoodAuth.listTools();
    console.log('✅ Tools list successful. Found', toolsResponse.result?.tools?.length || 0, 'tools');

    // Test calling a tool (if available)
    if (toolsResponse.result?.tools?.length > 0) {
      const firstTool = toolsResponse.result.tools[0];
      console.log(`\nTesting tool: ${firstTool.name}`);
      
      if (firstTool.name === 'search_artists') {
        const toolResponse = await clientGoodAuth.callTool('search_artists', {
          query: 'taylor swift',
          limit: 3
        });
        console.log('✅ Tool call successful:', JSON.stringify(toolResponse, null, 2));
      }
    }

  } catch (error: any) {
    console.log('❌ Unexpected error:', error.message);
    if (error.response) {
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // Test 4: Test different token scopes
  console.log('\n=== Test 4: Different token scopes ===');
  const readonlyClient = new McpTestClient(serverUrl, 'readonly-token-456');
  try {
    const response = await readonlyClient.initialize();
    console.log('✅ Readonly token accepted:', response.result?.capabilities ? 'Has capabilities' : 'No capabilities');
  } catch (error: any) {
    console.log('❌ Readonly token error:', error.message);
  }

  const adminClient = new McpTestClient(serverUrl, 'admin-token-789');
  try {
    const response = await adminClient.initialize();
    console.log('✅ Admin token accepted:', response.result?.capabilities ? 'Has capabilities' : 'No capabilities');
  } catch (error: any) {
    console.log('❌ Admin token error:', error.message);
  }

  console.log('\n=== Test completed ===');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}