#!/usr/bin/env tsx

import { createMcpAuthClient } from './src/mcp-auth-client.js';

async function testToolCall() {
  console.log('🧪 Testing tool call with correct parameters...');
  
  try {
    const client = await createMcpAuthClient({
      serverUrl: 'http://localhost:3001/mcp',
      bearerToken: 'test-token-123'
    });

    // Test search_artists with correct parameter name
    console.log('\n🎯 Testing search_artists with correct parameters...');
    const result = await client.callTool('search_artists', {
      name: 'taylor swift'  // Use 'name' instead of 'query'
    });

    console.log('✅ Tool call successful!');
    await client.disconnect();

  } catch (error: any) {
    console.log('❌ Tool call failed:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testToolCall().catch(console.error);
}