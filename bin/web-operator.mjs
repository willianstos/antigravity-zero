import { chromium } from 'playwright';
import { execSync } from 'child_process';

const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync("node " + IAM_LOGGER + " OPERATOR \"" + escapedMsg + "\"");
    } catch (e) {}
}

async function runBrowserAgent(targetUrl, task) {
    logIAM("🌐 Iniciando Browser Agent para: " + task);
    
    const browser = await chromium.launch({ headless: false }); // Headless false p/ controle soberano
    const page = await browser.newPage();

    try {
        logIAM("🚀 Navegando para " + targetUrl);
        await page.goto(targetUrl);
        
        // Simula uma ação baseada no task
        if (task.includes("screenshot")) {
            const screenshotPath = \`/home/zappro/antigravity-zero/artifacts/agent_vision_\${Date.now()}.png\`;
            await page.screenshot({ path: screenshotPath });
            logIAM("👁️ Captura de tela do navegador salva: " + screenshotPath);
        }

        // Exemplo de extração de dados
        const title = await page.title();
        logIAM("📄 Título da página: " + title);

        await browser.close();
        logIAM("✅ Missão concluída pelo Operador Web.");
    } catch (e) {
        logIAM("❌ Erro no Operador Web: " + e.message);
        if (browser) await browser.close();
    }
}

const target = process.argv[2];
const taskDescription = process.argv.slice(3).join(' ') || "Navegar e tirar screenshot";

if (target) {
    runBrowserAgent(target, taskDescription);
} else {
    console.log("Uso: node web-operator.mjs <url> <task>");
}
