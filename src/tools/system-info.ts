import { BaseTool, ToolResult } from './base-tool.js';
import { platform, arch, cpus, totalmem, freemem, uptime } from 'os';

/**
 * System Info Tool
 * 
 * Demonstrates:
 * - System information gathering
 * - Resource exposure via MCP
 */
export class SystemInfoTool extends BaseTool {
  name = 'system_info';
  description = 'Get information about the system (platform, CPU, memory, uptime)';
  inputSchema = {
    type: 'object' as const,
    properties: {
      detail: {
        type: 'string',
        enum: ['basic', 'full'],
        description: 'Level of detail (basic or full)',
      },
    },
    required: [],
  };

  async execute(args: any): Promise<ToolResult> {
    const { detail = 'basic' } = args;

    const basicInfo = {
      platform: platform(),
      architecture: arch(),
      uptime: Math.floor(uptime()),
      memory: {
        total: Math.round(totalmem() / 1024 / 1024), // MB
        free: Math.round(freemem() / 1024 / 1024), // MB
        used: Math.round((totalmem() - freemem()) / 1024 / 1024), // MB
      },
    };

    if (detail === 'full') {
      return {
        success: true,
        data: {
          ...basicInfo,
          cpus: {
            count: cpus().length,
            model: cpus()[0]?.model,
            speed: cpus()[0]?.speed,
          },
        },
      };
    }

    return {
      success: true,
      data: basicInfo,
    };
  }
}

