import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { execSync } from "node:child_process";
import { z } from "zod";

const server = new McpServer({
    name: "Antigravity Desktop Control",
    version: "1.0.0",
});

// Tool: Screenshoot
server.tool(
    "take_screenshot",
    {
        filename: z.string().describe("Nome do arquivo para salvar o print (ex: /tmp/screen.png)")
    },
    async ({ filename }) => {
        try {
            execSync(`scrot -o ${filename}`, { env: { ...process.env, DISPLAY: ":0.0" } });
            return {
                content: [{ type: "text", text: `Screenshot salvo em: ${filename}` }],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Erro ao tirar screenshot: ${error.message}` }],
                isError: true,
            };
        }
    }
);

// Tool: Type Text
server.tool(
    "type_text",
    {
        text: z.string().describe("Texto para digitar no teclado")
    },
    async ({ text }) => {
        try {
            // Escape single quotes for xdotool
            const escapedText = text.replace(/'/g, "'\\''");
            execSync(`xdotool type '${escapedText}'`, { env: { ...process.env, DISPLAY: ":0.0" } });
            return {
                content: [{ type: "text", text: `Digitado: ${text}` }],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Erro ao digitar: ${error.message}` }],
                isError: true,
            };
        }
    }
);

// Tool: Click Coordinate
server.tool(
    "click_coordinate",
    {
        x: z.number().describe("Coordenada X"),
        y: z.number().describe("Coordenada Y")
    },
    async ({ x, y }) => {
        try {
            execSync(`xdotool mousemove ${x} ${y} click 1`, { env: { ...process.env, DISPLAY: ":0.0" } });
            return {
                content: [{ type: "text", text: `Clicado em (${x}, ${y})` }],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Erro ao clicar: ${error.message}` }],
                isError: true,
            };
        }
    }
);

// Tool: List Windows
server.tool(
    "list_windows",
    {},
    async () => {
        try {
            const output = execSync("wmctrl -l", { env: { ...process.env, DISPLAY: ":0.0" } }).toString();
            return {
                content: [{ type: "text", text: output }],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Erro ao listar janelas: ${error.message}` }],
                isError: true,
            };
        }
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
