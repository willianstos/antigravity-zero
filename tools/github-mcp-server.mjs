/**
 * 🐙 GitHub MCP Server (Antigravity Elite)
 * Version: 2026.02.11 [Stable]
 * Protocol: @modelcontextprotocol/sdk (Stdio)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ErrorCode,
    McpError,
} from "@modelcontextprotocol/sdk/types.js";
import https from "https";
import fs from "fs";
import path from "path";

// 1. Env Configuration
const envPath = path.resolve(process.cwd(), '.env');
function getEnvVar(key) {
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(new RegExp(`^${key}=["']?([^"'\n]+)["']?`, 'm'));
    return match ? match[1] : null;
}

const GITHUB_TOKEN = getEnvVar('GITHUB_TOKEN');

// 2. Server Setup
const server = new Server(
    {
        name: "github-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// 3. GitHub API Client
function githubRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: endpoint,
            method: 'GET',
            headers: {
                'User-Agent': 'Antigravity-MCP',
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    resolve({ error: `GitHub API Error: ${res.statusCode}`, details: data });
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
}

// 4. Tools Definition
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_repositories",
                description: "List repositories for the authenticated user",
                inputSchema: {
                    type: "object",
                    properties: {
                        per_page: { type: "number", default: 10 },
                        sort: { type: "string", enum: ["created", "updated", "pushed", "full_name"], default: "updated" }
                    }
                },
            },
            {
                name: "search_repositories",
                description: "Search for repositories on GitHub",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string" },
                        per_page: { type: "number", default: 5 }
                    },
                    required: ["query"]
                },
            }
        ],
    };
});

// 5. Tool Implementation
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (!GITHUB_TOKEN) {
        throw new McpError(ErrorCode.InvalidRequest, "GITHUB_TOKEN missing in .env");
    }

    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "list_repositories": {
                const perPage = args?.per_page || 10;
                const sort = args?.sort || "updated";
                const repos = await githubRequest(`/user/repos?per_page=${perPage}&sort=${sort}`);

                if (repos.error) return { isError: true, content: [{ type: "text", text: JSON.stringify(repos) }] };

                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify(repos.map(r => ({
                            name: r.name,
                            full_name: r.full_name,
                            private: r.private,
                            html_url: r.html_url,
                            description: r.description
                        })), null, 2),
                    }],
                };
            }

            case "search_repositories": {
                const query = args?.query;
                if (!query) throw new Error("Query is required");

                const perPage = args?.per_page || 5;
                const result = await githubRequest(`/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}`);

                if (result.error) return { isError: true, content: [{ type: "text", text: JSON.stringify(result) }] };

                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify(result.items.map(r => ({
                            full_name: r.full_name,
                            stars: r.stargazers_count,
                            url: r.html_url,
                            description: r.description
                        })), null, 2),
                    }],
                };
            }

            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

// 6. Connect
const transport = new StdioServerTransport();
await server.connect(transport);
