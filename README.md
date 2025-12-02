# MCP Server Demo - Learning Project

A comprehensive learning project demonstrating how to build a **Model Context Protocol (MCP) server** with **Google ADK integration** using best practices.

## 🎯 Learning Objectives

This project teaches you:

1. **MCP Server Architecture**
   - How to structure an MCP server
   - Tool definitions and handlers
   - Resource management
   - Error handling patterns

2. **Best Practices**
   - TypeScript for type safety
   - Separation of concerns
   - Input validation and security
   - Error handling
   - Extensible architecture

3. **Google ADK Integration**
   - Integration points for Google Actions
   - Analytics and logging
   - Fulfillment handlers (placeholder)

## 📁 Project Structure

```
mcp-server-demo/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── tools/
│   │   ├── base-tool.ts      # Base tool interface
│   │   ├── calculator.ts     # Calculator tool example
│   │   ├── file-operations.ts # File operations tool
│   │   └── system-info.ts    # System information tool
│   └── integrations/
│       └── google-adk.ts     # Google ADK integration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode (with auto-reload)
npm run dev

# Run the built server
npm start
```

## 🛠️ Available Tools

### 1. Calculator Tool
Perform basic mathematical operations.

**Example:**
```json
{
  "name": "calculator",
  "arguments": {
    "operation": "add",
    "a": 10,
    "b": 5
  }
}
```

### 2. File Operations Tool
Read, write, list, and get info about files.

**Example:**
```json
{
  "name": "file_operations",
  "arguments": {
    "operation": "read",
    "path": "README.md"
  }
}
```

### 3. System Info Tool
Get system information (platform, memory, CPU, etc.).

**Example:**
```json
{
  "name": "system_info",
  "arguments": {
    "detail": "full"
  }
}
```

## 🔌 Google ADK Integration

The project includes a Google ADK integration module that demonstrates:

- **Analytics Logging**: Track tool usage
- **Fulfillment Handlers**: Process Google Assistant requests (placeholder)
- **Usage Statistics**: Get insights into tool usage

### Enabling Google ADK

Set the environment variable:
```bash
export GOOGLE_ADK_ENABLED=true
```

### Next Steps for Full Integration

1. **Set up Google Actions Project**
   - Create a project in Google Cloud Console
   - Enable Actions API
   - Set up OAuth credentials

2. **Implement Webhook Server**
   - Use Express.js or similar
   - Handle fulfillment requests
   - Connect to MCP server tools

3. **Deploy**
   - Deploy to Google Cloud Functions or Cloud Run
   - Configure webhook URL in Actions Console

## 📚 Best Practices Demonstrated

### 1. **Type Safety**
- Full TypeScript implementation
- Strict type checking enabled
- Interface definitions for all tools

### 2. **Security**
- Path validation (prevents directory traversal)
- Input sanitization
- Error message sanitization

### 3. **Error Handling**
- Comprehensive try-catch blocks
- Meaningful error messages
- Graceful degradation

### 4. **Code Organization**
- Separation of concerns
- Modular tool architecture
- Clear abstraction layers

### 5. **Extensibility**
- Easy to add new tools (extend `BaseTool`)
- Plugin-like architecture
- Configuration-driven behavior

## 🧪 Testing Your MCP Server

### Using Claude Desktop

1. Add to Claude Desktop configuration:
```json
{
  "mcpServers": {
    "demo": {
      "command": "node",
      "args": ["/path/to/mcp-server-demo/dist/index.js"]
    }
  }
}
```

2. Restart Claude Desktop
3. The tools should be available in Claude

### Using MCP Client

You can also test with an MCP client library or create a simple test script.

## 🎓 Learning Path

### Beginner Tasks
1. ✅ Understand the project structure
2. ✅ Run the server and test tools
3. ✅ Read through the code comments
4. ✅ Modify calculator tool to add new operations

### Intermediate Tasks
1. Add a new tool (e.g., `weather` tool using an API)
2. Implement resource caching
3. Add tool usage rate limiting
4. Create unit tests for tools

### Advanced Tasks
1. Implement full Google ADK webhook server
2. Add authentication/authorization
3. Implement tool chaining
4. Add streaming responses
5. Create a remote MCP server (HTTP transport)

## 📖 Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [Google Actions Documentation](https://developers.google.com/assistant)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

This is a learning project! Feel free to:
- Add more example tools
- Improve error handling
- Add tests
- Enhance documentation

## 📝 License

MIT

---

**Happy Learning! 🚀**

