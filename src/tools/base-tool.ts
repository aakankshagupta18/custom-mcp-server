/**
 * Base Tool Interface
 * 
 * Best Practice: Define a common interface for all tools
 * This ensures consistency and makes it easy to add new tools
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Abstract base class for all tools
 * Best Practice: Use abstract classes to enforce structure
 */
export abstract class BaseTool {
  abstract name: string;
  abstract description: string;
  abstract inputSchema: ToolDefinition['inputSchema'];

  /**
   * Get the tool definition for MCP
   */
  getDefinition(): ToolDefinition {
    return {
      name: this.name,
      description: this.description,
      inputSchema: this.inputSchema,
    };
  }

  /**
   * Validate tool arguments
   * Best Practice: Validate inputs before processing
   */
  validateArguments(args: any): void {
    if (!args || typeof args !== 'object') {
      throw new Error('Arguments must be an object');
    }

    const { required = [] } = this.inputSchema;
    for (const field of required) {
      if (!(field in args)) {
        throw new Error(`Missing required argument: ${field}`);
      }
    }

    // Type validation
    const { properties } = this.inputSchema;
    for (const [key, value] of Object.entries(args)) {
      if (properties[key]) {
        const expectedType = properties[key].type;
        const actualType = typeof value;

        if (expectedType === 'number' && actualType !== 'number') {
          throw new Error(`Argument "${key}" must be a number`);
        }
        if (expectedType === 'string' && actualType !== 'string') {
          throw new Error(`Argument "${key}" must be a string`);
        }
        if (expectedType === 'boolean' && actualType !== 'boolean') {
          throw new Error(`Argument "${key}" must be a boolean`);
        }
      }
    }
  }

  /**
   * Execute the tool
   * Best Practice: Make execution async for I/O operations
   */
  abstract execute(args: any): Promise<ToolResult>;
}

