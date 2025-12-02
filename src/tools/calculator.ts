import { BaseTool, ToolResult } from './base-tool.js';

/**
 * Calculator Tool
 * 
 * Demonstrates:
 * - Simple tool implementation
 * - Input validation
 * - Error handling
 */
export class CalculatorTool extends BaseTool {
  name = 'calculator';
  description = 'Perform basic mathematical calculations (add, subtract, multiply, divide)';
  inputSchema = {
    type: 'object' as const,
    properties: {
      operation: {
        type: 'string',
        enum: ['add', 'subtract', 'multiply', 'divide'],
        description: 'The mathematical operation to perform',
      },
      a: {
        type: 'number',
        description: 'First number',
      },
      b: {
        type: 'number',
        description: 'Second number',
      },
    },
    required: ['operation', 'a', 'b'],
  };

  async execute(args: any): Promise<ToolResult> {
    const { operation, a, b } = args;

    let result: number;

    switch (operation) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        if (b === 0) {
          throw new Error('Division by zero is not allowed');
        }
        result = a / b;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return {
      success: true,
      data: {
        operation,
        operands: { a, b },
        result,
      },
    };
  }
}

