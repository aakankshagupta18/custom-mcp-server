#!/usr/bin/env node

/**
 * Manual JSON-RPC Test Script
 * 
 * This script demonstrates how to manually send JSON-RPC messages to the MCP server.
 * This is useful for understanding the MCP protocol at a low level.
 * 
 * Usage:
 *   1. Start your MCP server in one terminal: npm start
 *   2. In another terminal, run this script: npm run test:manual
 * 
 * Note: This script connects to an already-running server via stdio.
 * However, since stdio is already taken by the terminal, this script
 * spawns its own server instance for demonstration purposes.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = join(__dirname, '..', 'dist', 'index.js');

/**
 * Send a JSON-RPC message to the server
 */
function sendMessage(server: any, message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = Date.now();
    const request = {
      jsonrpc: '2.0',
      id,
      ...message,
    };

    let responseBuffer = '';
    let errorBuffer = '';

    // Set up response handler
    const responseHandler = (data: Buffer) => {
      responseBuffer += data.toString();
      try {
        const lines = responseBuffer.split('\n').filter((line) => line.trim());
        for (const line of lines) {
          const response = JSON.parse(line);
          if (response.id === id) {
            server.stdout.removeListener('data', responseHandler);
            server.stderr.removeListener('data', errorHandler);
            if (response.error) {
              reject(new Error(response.error.message || 'Request failed'));
            } else {
              resolve(response.result);
            }
            return;
          }
        }
      } catch (e) {
        // Not a complete JSON response yet, wait for more
      }
    };

    const errorHandler = (data: Buffer) => {
      errorBuffer += data.toString();
      // Log server output (MCP servers log to stderr)
      if (data.toString().includes('started and ready')) {
        console.log('✅ Server started');
      }
    };

    server.stdout.on('data', responseHandler);
    server.stderr.on('data', errorHandler);

    // Send the request
    server.stdin.write(JSON.stringify(request) + '\n');

    // Timeout after 5 seconds
    setTimeout(() => {
      server.stdout.removeListener('data', responseHandler);
      server.stderr.removeListener('data', errorHandler);
      reject(new Error('Request timeout'));
    }, 5000);
  });
}

/**
 * Manual test demonstration
 */
async function manualTest() {
  console.log('🔧 Manual JSON-RPC Test');
  console.log('=======================\n');
  console.log('This demonstrates the MCP protocol at a low level.\n');

  // Spawn the server
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    console.error('\nMake sure you have run: npm run build');
    process.exit(1);
  });

  // Wait for server to be ready
  await new Promise((resolve) => {
    server.stderr.on('data', (data) => {
      if (data.toString().includes('started and ready')) {
        console.log('✅ Server started\n');
        resolve(undefined);
      }
    });
  });

  try {
    // Step 1: Initialize the connection
    console.log('📡 Step 1: Sending initialize request...');
    const initResponse = await sendMessage(server, {
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'manual-test-client',
          version: '1.0.0',
        },
      },
    });
    console.log('Initialize response:', JSON.stringify(initResponse, null, 2));
    console.log('');

    // Step 2: Send initialized notification
    console.log('📡 Step 2: Sending initialized notification...');
    server.stdin.write(
      JSON.stringify({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
      }) + '\n'
    );
    console.log('✅ Initialized notification sent\n');

    // Wait a bit for the server to process
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Step 3: List tools
    console.log('📡 Step 3: Requesting list of tools...');
    const toolsResponse = await sendMessage(server, {
      method: 'tools/list',
      params: {},
    });
    console.log('Tools:', JSON.stringify(toolsResponse, null, 2));
    console.log('');

    // Step 4: Call a tool
    console.log('📡 Step 4: Calling calculator tool (6 × 7)...');
    const calcResponse = await sendMessage(server, {
      method: 'tools/call',
      params: {
        name: 'calculator',
        arguments: {
          operation: 'multiply',
          a: 6,
          b: 7,
        },
      },
    });
    console.log('Calculator result:', JSON.stringify(calcResponse, null, 2));
    console.log('');

    // Step 5: List resources
    console.log('📡 Step 5: Requesting list of resources...');
    const resourcesResponse = await sendMessage(server, {
      method: 'resources/list',
      params: {},
    });
    console.log('Resources:', JSON.stringify(resourcesResponse, null, 2));
    console.log('');

    console.log('✅ Manual test completed successfully!');
    console.log('\n💡 This demonstrates the raw JSON-RPC protocol used by MCP.');
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  } finally {
    server.kill();
  }
}

// Run the test
manualTest().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

