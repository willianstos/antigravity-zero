import fs from 'fs';
import https from 'https';
import path from 'path';
import { execSync } from 'child_process';

const DOWNLOAD_DIR = '/data/manuals/queue/';
const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync("node " + IAM_LOGGER + " SCOUT \"" + escapedMsg + "\"");
    } catch (e) {}
}

async function searchAndDownload(query) {
    logIAM("🔭 Iniciando busca por manuais: " + query);
    
    try {
        // 1. Usa o perplexity_search.mjs para achar o PDF
        const searchCmd = "node /home/zappro/antigravity-zero/bin/perplexity_search.mjs \"Link direto para download de manual PDF de: " + query + ". Responda APENAS o link direto se encontrar.\"";
        const pdfUrl = execSync(searchCmd).toString().trim().match(/https?:\/\/[^\s]+\.pdf/);

        if (!pdfUrl) {
            logIAM("⚠️ Nenhum link direto de PDF encontrado via Perplexity.");
            return;
        }

        const url = pdfUrl[0];
        const fileName = path.basename(url);
        const filePath = path.join(DOWNLOAD_DIR, fileName);

        logIAM("🎯 PDF Encontrado: " + url);
        
        if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

        // 2. Download direto
        logIAM("📦 Baixando manual para a fila...");
        const file = fs.createWriteStream(filePath);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Handle redirection (simplified)
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                logIAM("✅ Manual salvo em " + filePath + ". Pronto para o Worker!");
            });
        });
    } catch (e) {
        logIAM("❌ Erro no Scout v2: " + e.message);
    }
}

const query = process.argv.slice(2).join(' ');
searchAndDownload(query || "Daikin VRV IV Service Manual");
