import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import os from "node:os";

// Create an MCP server
const server = new McpServer({
    name: "System Monitor",
    version: "1.0.0",
});

// Resource: System Stats
server.resource(
    "system-stats",
    new ResourceTemplate("system://stats", { list: undefined }),
    async (uri, { request }) => {
        const cpus = os.cpus();
        const load = os.loadavg();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();

        const stats = {
            cpu: {
                model: cpus[0].model,
                cores: cpus.length,
                load_1m: load[0],
                load_5m: load[1],
                load_15m: load[2],
            },
            memory: {
                total_gb: (totalMem / 1024 / 1024 / 1024).toFixed(2),
                free_gb: (freeMem / 1024 / 1024 / 1024).toFixed(2),
                used_percent: (((totalMem - freeMem) / totalMem) * 100).toFixed(1) + "%",
            },
            uptime_hours: (os.uptime() / 3600).toFixed(2),
            platform: os.platform(),
            arch: os.arch(),
        };

        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(stats, null, 2),
                },
            ],
        };
    }
);

// Tool: Ping
server.tool(
    "ping",
    {},
    async () => {
        return {
            content: [{ type: "text", text: "pong" }],
        };
    }
);

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
