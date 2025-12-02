#!/bin/bash

# Simple server verification script
# This just checks if the server can start without errors

echo "🔍 Verifying MCP Server..."
echo ""

# Check if dist/index.js exists
if [ ! -f "dist/index.js" ]; then
    echo "❌ Error: dist/index.js not found"
    echo "   Run: npm run build"
    exit 1
fi

echo "✅ Server binary found"
echo ""
echo "Starting server for 2 seconds to verify it works..."
echo ""

# Start server with timeout
timeout 2 node dist/index.js 2>&1 | head -5 || true

echo ""
echo "✅ Server verification complete!"
echo ""
echo "If you saw 'MCP Server Demo started and ready', your server is working! 🎉"

