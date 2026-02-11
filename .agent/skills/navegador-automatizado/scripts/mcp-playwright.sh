#!/bin/bash
# Wrapper for Playwright MCP
# Aligning with H2 Policy (10/02/2026)

# Print current working directory to stderr for traceability
echo "Starting Playwright MCP from: $(pwd)" >&2

# Ensure we are in the workspace root
cd /home/zappro/antigravity-zero

# Verify playwright is installed
if [ ! -d "node_modules/playwright" ]; then
    echo "[!] Playwright not found in node_modules. Please run 'npm install'." >&2
    exit 1
fi

# Run the MCP server
# No automated credential logic here.
exec npx -y @playwright/mcp@latest --port 3550
