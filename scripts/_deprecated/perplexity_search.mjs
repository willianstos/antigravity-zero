import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');
const env = fs.readFileSync(envPath, 'utf8');
const keyMatch = env.match(/PERPLEXITY_API_KEY=\"?([^\s\"]+)\"?/);
const key = keyMatch ? keyMatch[1] : null;

const IAM_LOGGER = path.join(__dirname, 'iam-logger.mjs');

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync("node " + IAM_LOGGER + " SCOUT \"" + escapedMsg + "\"");
    } catch (e) {}
}

async function search(query) {
    if (!key) {
        logIAM("❌ Erro: PERPLEXITY_API_KEY não encontrada no .env");
        return "Erro: Chave de API não configurada.";
    }

    logIAM("🌐 Pesquisando no Perplexity: " + query);

    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "sonar-pro",
                messages: [
                    { role: 'system', content: 'Seja preciso e conciso. Responda em Português Técnico (PT-BR). Foco em OpenClaw, K3s e HVAC.' },
                    { role: 'user', content: query }
                ]
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        logIAM("✅ Pesquisa concluída com sucesso.");
        return content;
    } catch (e) {
        logIAM("❌ Erro na API Perplexity: " + e.message + ". Acionando Fallback H2...");
        return "Erro na pesquisa: " + e.message;
    }
}

const query = process.argv.slice(2).join(' ');
if (query) {
    search(query).then(console.log).catch(console.error);
} else {
    console.log("Uso: node perplexity_search.mjs <termo de busca>");
}
