#!/bin/bash

# Manual Test Script for MCP Server
# This script helps you test the MCP server manually

echo "🧪 MCP Server Manual Test"
echo "========================"
echo ""
echo "This script will help you test your MCP server."
echo "Make sure the server is built: npm run build"
echo ""

# Check if dist/index.js exists
if [ ! -f "dist/index.js" ]; then
    echo "❌ Error: dist/index.js not found. Run 'npm run build' first."
    exit 1
fi

echo "✅ Server binary found"
echo ""
echo "To test your server:"
echo ""
echo "1. Start the server in one terminal:"
echo "   npm start"
echo ""
echo "2. The server is now running and listening on stdio"
echo ""
echo "3. To use with Claude Desktop:"
echo "   - Open: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo "   - Add this configuration:"
echo ""
cat << 'EOF'
{
  "mcpServers": {
    "demo": {
      "command": "node",
      "args": ["ABSOLUTE_PATH_TO/dist/index.js"]
    }
  }
}
EOF
echo ""
echo "   Replace ABSOLUTE_PATH_TO with: $(pwd)"
echo ""
echo "4. Restart Claude Desktop and test with:"
echo "   - 'Use the calculator to add 10 and 5'"
echo "   - 'What's the system information?'"
echo "   - 'List files in the current directory'"
echo ""

