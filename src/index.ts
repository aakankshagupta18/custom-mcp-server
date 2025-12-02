#!/usr/bin/env node

/**
 * MCP Server Demo - Learning Project
 * 
 * This is a local MCP server that demonstrates:
 * - Basic MCP server implementation
 * - Tool definitions and handlers
 * - Resource management
 * - Error handling best practices
 * - Integration points for Google ADK
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { CalculatorTool } from './tools/calculator.js';
import { FileOperationsTool } from './tools/file-operations.js';
import { SystemInfoTool } from './tools/system-info.js';
import { GoogleADKIntegration } from './integrations/google-adk.js';

/**
 * Main MCP Server Class
 * 
 * Best Practices Demonstrated:
 * 1. Separation of concerns (tools in separate modules)
 * 2. Error handling with proper error types
 * 3. Type safety with TypeScript
 * 4. Extensible architecture for adding new tools
 */
class MCPServerDemo {
  private server: Server;
  private tools: Map<string, any>;
  private googleADK: GoogleADKIntegration;

  constructor() {
    // Initialize MCP Server
    this.server = new Server(
      {
        name: 'mcp-server-demo',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    // Initialize tools
    this.tools = new Map();
    this.registerTools();

    // Initialize Google ADK integration
    this.googleADK = new GoogleADKIntegration();

    // Set up request handlers
    this.setupHandlers();

    // Set up error handling
    this.setupErrorHandling();
  }

  /**
   * Register all available tools
   * Best Practice: Centralized tool registration
   */
  private registerTools(): void {
    const toolInstances = [
      new CalculatorTool(),
      new FileOperationsTool(),
      new SystemInfoTool(),
    ];

    for (const tool of toolInstances) {
      this.tools.set(tool.name, tool);
    }
  }

  /**
   * Set up MCP request handlers
   * Best Practice: Clear separation of handler logic
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const toolList = Array.from(this.tools.values()).map((tool) =>
        tool.getDefinition()
      );
      return { tools: toolList };
    });

    // Handle tool execution
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        const { name, arguments: args } = request.params;

        const tool = this.tools.get(name);
        if (!tool) {
          throw new Error(`Tool "${name}" not found`);
        }

        try {
          // Validate arguments
          tool.validateArguments(args);

          // Execute tool
          const result = await tool.execute(args);

          // Optional: Log to Google ADK for analytics
          await this.googleADK.logToolUsage(name, args, result);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'file:///system-info',
            name: 'System Information',
            description: 'Current system information',
            mimeType: 'application/json',
          },
        ],
      };
    });

    // Read resources
    this.server.setRequestHandler(
      ReadResourceRequestSchema,
      async (request) => {
        const { uri } = request.params;

        if (uri === 'file:///system-info') {
          const systemInfo = await new SystemInfoTool().execute({});
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(systemInfo, null, 2),
              },
            ],
          };
        }

        throw new Error(`Resource "${uri}" not found`);
      }
    );
  }

  /**
   * Set up error handling
   * Best Practice: Comprehensive error handling
   */
  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Server Demo started and ready');
  }
}

// Start the server
const server = new MCPServerDemo();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

