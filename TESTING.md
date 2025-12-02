# Testing Your MCP Server

There are several ways to test your MCP server. Choose the method that works best for you!

## 🧪 Method 1: Quick Verification (Easiest)

If your server is already running and shows:
```
MCP Server Demo started and ready
```

**Your server is working! ✅** 

The server is waiting for connections. It communicates via stdio (standard input/output), so it's designed to be used by client applications like Claude Desktop, not directly in the terminal.

**To actually test it, use one of the methods below.**

## 🖥️ Method 2: Test with Claude Desktop (Best for Real-World Usage)

Claude Desktop is the most common way to use MCP servers in production.

### Step 1: Find Your Claude Desktop Config

**macOS:**
```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Step 2: Add Your MCP Server

Add this configuration (replace the path with your actual project path):

```json
{
  "mcpServers": {
    "demo": {
      "command": "node",
      "args": ["/Users/agupta/Documents/Google_ADK_Projects/mcp-server-demo/dist/index.js"]
    }
  }
}
```

**Important:** Use the **absolute path** to your `dist/index.js` file!

### Step 3: Restart Claude Desktop

1. Quit Claude Desktop completely
2. Reopen it
3. Check the console/logs to see if the server connected

### Step 4: Test in Claude

Try asking Claude:
- "Use the calculator to multiply 15 by 23"
- "What's the system information?"
- "List the files in the current directory"
- "Read the README.md file"

## 🔧 Method 3: Manual Testing with Node.js REPL

You can also test manually using Node.js:

```bash
# Start the server in one terminal
npm start

# In another terminal, you can send JSON-RPC messages via stdin
# (This is more advanced and requires understanding the MCP protocol)
```

## 📝 Method 4: Create Your Own Test Script

You can create custom test scripts. Here's a simple example:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/index.js'],
});

const client = new Client(
  { name: 'my-test', version: '1.0.0' },
  { capabilities: {} }
);

await client.connect(transport);

// Test a tool
const result = await client.request(
  { method: 'tools/call' },
  {
    name: 'calculator',
    arguments: { operation: 'add', a: 10, b: 5 },
  }
);

console.log(result);
```

## 🐛 Troubleshooting

### Server won't start
- Make sure you ran `npm run build` first
- Check that `dist/index.js` exists
- Look for error messages in the console

### Claude Desktop can't find the server
- Verify the absolute path is correct
- Make sure the path uses forward slashes (even on Windows)
- Check that `dist/index.js` exists at that path
- Restart Claude Desktop after making config changes

### Tools not showing up in Claude
- Check Claude Desktop logs/console for errors
- Verify the server is starting correctly
- Make sure the MCP server config is valid JSON

### Test client fails
- Ensure the server builds successfully (`npm run build`)
- Check that all dependencies are installed (`npm install`)
- Look at the error message for specific issues

## ✅ Expected Test Results

When running `npm run test:client`, you should see:

1. ✅ Connection successful
2. ✅ 3 tools listed (calculator, file_operations, system_info)
3. ✅ Calculator returns: `{ operation: "multiply", operands: { a: 6, b: 7 }, result: 42 }`
4. ✅ System info returns platform, architecture, memory info
5. ✅ File operations lists directory contents
6. ✅ Resources are listed and readable

## 🎯 Next Steps After Testing

Once your server is working:
1. Try adding a new tool (see `src/tools/` for examples)
2. Test it with the test client
3. Use it in Claude Desktop
4. Extend the Google ADK integration

Happy testing! 🚀

