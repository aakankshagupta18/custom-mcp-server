#!/usr/bin/env node

/**
 * Simple MCP Test Script
 * 
 * This script tests the MCP server by sending JSON-RPC messages directly.
 * Make sure the server is NOT running - this script will start it automatically.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = join(__dirname, 'dist', 'index.js');

console.log('🧪 MCP Server Test');
console.log('==================\n');
console.log('This script will test your MCP server.\n');
console.log('⚠️  Make sure the server is NOT running in another terminal!\n');
console.log('The test script will automatically start the server.\n');

// Spawn the server
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
});

let serverOutput = '';
let serverError = '';

server.stdout.on('data', (data) => {
  serverOutput += data.toString();
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  serverError += output;
  // MCP servers write to stderr for logging
  if (output.includes('started and ready')) {
    console.log('✅ Server started successfully\n');
    runTests();
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  console.error('\nMake sure you have run: npm run build');
  process.exit(1);
});

// Test messages to send
const tests = [
  {
    name: 'List Tools',
    message: {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {},
    },
  },
  {
    name: 'Calculator Test (6 × 7)',
    message: {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'calculator',
        arguments: {
          operation: 'multiply',
          a: 6,
          b: 7,
        },
      },
    },
  },
  {
    name: 'System Info Test',
    message: {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'system_info',
        arguments: {
          detail: 'basic',
        },
      },
    },
  },
];

let testIndex = 0;
let responses = {};

function runTests() {
  console.log('📋 Running tests...\n');

  // Send initialization message first
  const initMessage = {
    jsonrpc: '2.0',
    id: 0,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0',
      },
    },
  };

  server.stdin.write(JSON.stringify(initMessage) + '\n');

  // Wait a bit, then send initialized
  setTimeout(() => {
    const initializedMessage = {
      jsonrpc: '2.0',
      method: 'notifications/initialized',
    };
    server.stdin.write(JSON.stringify(initializedMessage) + '\n');

    // Start sending test messages
    setTimeout(() => {
      sendNextTest();
    }, 100);
  }, 100);
}

function sendNextTest() {
  if (testIndex >= tests.length) {
    // All tests sent, wait for responses and show results
    setTimeout(() => {
      showResults();
      server.kill();
      process.exit(0);
    }, 1000);
    return;
  }

  const test = tests[testIndex];
  console.log(`🧪 Test ${testIndex + 1}: ${test.name}`);
  server.stdin.write(JSON.stringify(test.message) + '\n');
  testIndex++;

  setTimeout(() => {
    sendNextTest();
  }, 500);
}

function showResults() {
  console.log('\n📊 Test Results:');
  console.log('================\n');
  console.log('Server output:', serverOutput);
  console.log('Server logs:', serverError);
  console.log('\n✅ Basic connectivity test passed!');
  console.log('\n💡 For full testing, use Claude Desktop or the TypeScript test client.');
}

// Handle server exit
server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\n❌ Server exited with code ${code}`);
    process.exit(1);
  }
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('\n⏱️  Test timeout');
  server.kill();
  process.exit(1);
}, 10000);

