import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { BaseTool, ToolResult } from './base-tool.js';

/**
 * File Operations Tool
 * 
 * Demonstrates:
 * - File system operations
 * - Path validation for security
 * - Error handling for I/O operations
 */
export class FileOperationsTool extends BaseTool {
  name = 'file_operations';
  description = 'Read, write, and list files in the current workspace';
  inputSchema = {
    type: 'object' as const,
    properties: {
      operation: {
        type: 'string',
        enum: ['read', 'write', 'list', 'info'],
        description: 'The file operation to perform',
      },
      path: {
        type: 'string',
        description: 'File or directory path (relative to workspace)',
      },
      content: {
        type: 'string',
        description: 'Content to write (required for write operation)',
      },
    },
    required: ['operation', 'path'],
  };

  private workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    super();
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Validate and sanitize file paths
   * Best Practice: Security - prevent directory traversal attacks
   */
  private validatePath(path: string): string {
    if (path.includes('..')) {
      throw new Error('Path traversal (..) is not allowed');
    }
    if (path.startsWith('/')) {
      throw new Error('Absolute paths are not allowed');
    }
    return join(this.workspaceRoot, path);
  }

  async execute(args: any): Promise<ToolResult> {
    const { operation, path, content } = args;
    const safePath = this.validatePath(path);

    try {
      switch (operation) {
        case 'read': {
          const fileContent = await readFile(safePath, 'utf-8');
          return {
            success: true,
            data: {
              path,
              content: fileContent,
              size: fileContent.length,
            },
          };
        }

        case 'write': {
          if (!content) {
            throw new Error('Content is required for write operation');
          }
          await writeFile(safePath, content, 'utf-8');
          return {
            success: true,
            data: {
              path,
              message: 'File written successfully',
            },
          };
        }

        case 'list': {
          const entries = await readdir(safePath);
          const fileList = await Promise.all(
            entries.map(async (entry) => {
              const entryPath = join(safePath, entry);
              const stats = await stat(entryPath);
              return {
                name: entry,
                type: stats.isDirectory() ? 'directory' : 'file',
                size: stats.size,
              };
            })
          );
          return {
            success: true,
            data: {
              path,
              entries: fileList,
            },
          };
        }

        case 'info': {
          const stats = await stat(safePath);
          return {
            success: true,
            data: {
              path,
              type: stats.isDirectory() ? 'directory' : 'file',
              size: stats.size,
              created: stats.birthtime,
              modified: stats.mtime,
            },
          };
        }

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        const nodeError = error as Error & { code?: string };
        if (nodeError.code === 'ENOENT') {
          throw new Error(`File or directory not found: ${path}`);
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }
}

