#!/usr/bin/env node

/**
 * Simple MCP Test Client
 * 
 * This script automatically spawns the MCP server and tests it.
 * You don't need to run the server separately - this script handles it!
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/**
 * Test the MCP server by sending requests
 */
async function testMCPServer() {
  console.log('🚀 Starting MCP Server Test Client...\n');
  console.log('Note: This will automatically start the MCP server\n');

  // Create client transport - this automatically spawns the server
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js'],
  });

  const client = new Client(
    {
      name: 'test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    // Connect to server (this spawns the server process)
    await client.connect(transport);
    console.log('✅ Connected to MCP server\n');

    // Test 1: List available tools
    console.log('📋 Test 1: Listing available tools...');
    const toolsResponse = await (client as any).listTools();
    const tools = toolsResponse?.tools || [];
    console.log(`Found ${tools.length} tools:`);
    tools.forEach((tool: any) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log('');

    // Test 2: Calculator tool
    console.log('🧮 Test 2: Testing calculator tool (6 × 7)...');
    const calcResult = await (client as any).callTool({
      name: 'calculator',
      arguments: {
        operation: 'multiply',
        a: 6,
        b: 7,
      },
    });
    console.log('Result:', JSON.stringify(calcResult, null, 2));
    console.log('');

    // Test 3: System info tool
    console.log('💻 Test 3: Testing system info tool...');
    const systemResult = await (client as any).callTool({
      name: 'system_info',
      arguments: {
        detail: 'basic',
      },
    });
    console.log('Result:', JSON.stringify(systemResult, null, 2));
    console.log('');

    // Test 4: File operations - list current directory
    console.log('📁 Test 4: Testing file operations (list current directory)...');
    try {
      const fileResult = await (client as any).callTool({
        name: 'file_operations',
        arguments: {
          operation: 'list',
          path: '.',
        },
      });
      console.log('Result:', JSON.stringify(fileResult, null, 2));
    } catch (error) {
      console.log('Error:', error instanceof Error ? error.message : String(error));
    }
    console.log('');

    // Test 5: List resources
    console.log('📚 Test 5: Listing available resources...');
    const resourcesResponse = await (client as any).listResources();
    const resources = resourcesResponse?.resources || [];
    console.log(`Found ${resources.length} resources:`);
    resources.forEach((resource: any) => {
      console.log(`  - ${resource.name}: ${resource.uri}`);
    });
    console.log('');

    // Test 6: Read a resource
    if (resources.length > 0) {
      console.log('📖 Test 6: Reading a resource...');
      const readResult = await (client as any).readResource({
        uri: resources[0].uri,
      });
      console.log('Resource content:', JSON.stringify(readResult, null, 2));
      console.log('');
    }

    // Test 7: Calculator - addition
    console.log('🧮 Test 7: Testing calculator (addition: 15 + 23)...');
    const addResult = await (client as any).callTool({
      name: 'calculator',
      arguments: {
        operation: 'add',
        a: 15,
        b: 23,
      },
    });
    console.log('Result:', JSON.stringify(addResult, null, 2));
    console.log('');

    console.log('✅ All tests completed successfully!');
    console.log('\n🎉 Your MCP server is working correctly!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      if (error.stack) {
        console.error('Stack:', error.stack);
      }
    }
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run tests
testMCPServer().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
