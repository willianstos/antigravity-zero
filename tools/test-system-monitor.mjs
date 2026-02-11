import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
    command: "node",
    args: ["tools/system-monitor-mcp.mjs"],
});

const client = new Client(
    {
        name: "test-client",
        version: "1.0.0",
    },
    {
        capabilities: {},
    }
);

await client.connect(transport);

console.log("Connected to server");

const resources = await client.listResources();
console.log("Resources:", resources);

const stats = await client.readResource({ uri: "system://stats" });
console.log("Stats:", stats.contents[0].text);

await client.close();
