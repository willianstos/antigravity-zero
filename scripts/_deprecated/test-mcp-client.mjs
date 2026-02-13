/**
 * 🧪 MCP Test Client
 * Sends JSON-RPC via Stdio to validate the server.
 */

import { spawn } from 'child_process';
import path from 'path';

const serverScript = path.resolve('tools/github-mcp-server.mjs');
console.log(`🔌 Connecting to MCP Server: ${serverScript}`);

const server = spawn('node', [serverScript], {
    stdio: ['pipe', 'pipe', 'inherit']
});

// JSON-RPC 2.0 Request: List Tools
const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
};

console.log("📤 Sending Request:", JSON.stringify(request));
server.stdin.write(JSON.stringify(request) + "\n");

let buffer = '';

server.stdout.on('data', (data) => {
    buffer += data.toString();
    // Check for newline as delimiter (simple parsing)
    if (buffer.includes('\n')) {
        const lines = buffer.split('\n');
        lines.forEach(line => {
            if (!line.trim()) return;
            try {
                const response = JSON.parse(line);
                console.log("📥 Received Response:", JSON.stringify(response, null, 2));

                if (response.result && response.result.tools) {
                    console.log(`✅ Success! Found ${response.result.tools.length} tools.`);
                    process.exit(0);
                }
            } catch (e) {
                // Partial JSON, wait for more data
            }
        });
    }
});

server.on('error', (err) => {
    console.error("❌ Server Error:", err);
    process.exit(1);
});

// Timeout
setTimeout(() => {
    console.error("⏰ Timeout waiting for response");
    server.kill();
    process.exit(1);
}, 5000);
