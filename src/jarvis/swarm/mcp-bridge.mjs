#!/usr/bin/env node
/**
 * 🌉 JARVIS MCP BRIDGE — Model Context Protocol Gateway
 * Exposes Jarvis agents as standardized MCP tools.
 * Compatible with Anthropic/Meta MCP standard.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { JarvisOrchestrator } from "../orchestrator.mjs";

const server = new Server(
    {
        name: "antigravity-zero",
        version: "1.5.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

const jarvis = new JarvisOrchestrator();
await jarvis.boot();

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "terminal_shell",
                description: "Executa comandos shell no sistema Ubuntu.",
                inputSchema: {
                    type: "object",
                    properties: {
                        command: { type: "string" },
                        useSudo: { type: "boolean" }
                    },
                    required: ["command"],
                },
            },
            {
                name: "vision_screenshot",
                description: "Captura um screenshot da tela.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "browser_navigate",
                description: "Navega para uma URL no navegador.",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: { type: "string" }
                    },
                    required: ["url"],
                },
            }
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        let result;
        if (name === "terminal_shell") {
            result = await jarvis.execute("terminal", "shell", args);
        } else if (name === "vision_screenshot") {
            result = await jarvis.execute("vision", "capture", {});
        } else if (name === "browser_navigate") {
            result = await jarvis.execute("browser", "navigate", args);
        } else {
            throw new Error(`Tool not found: ${name}`);
        }

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("🚀 JARVIS MCP Bridge running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in MCP Bridge:", error);
    process.exit(1);
});
