import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Script de Elite: Busca PDFs via Firecrawl CLI e baixa via Playwright.
 * Uso: node pesquisa_download_pdf.mjs --query "exemplo"
 */

const args = process.argv.slice(2);
const query = args.find(a => a.startsWith('--query'))?.split('=')[1] || "tutorial pdf nodejs";
const artifactsDir = path.join(process.cwd(), 'artifacts');

if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir);
}

console.log(`[Rastreador] Iniciando busca por: ${query}`);

try {
    // 1. Usa Firecrawl Search para achar links de PDF
    const searchCommand = `firecrawl search "${query} filetype:pdf" --limit 3`;
    console.log(`[Firecrawl] Rodando: ${searchCommand}`);

    // Captura a saída (preferencialmente estruturada se a CLI suportar)
    const output = execSync(searchCommand).toString();
    console.log(`[Resultado] Links encontrados:\n${output}`);

    // Nota: Em um cenário real, processaríamos o output para extrair o link exato.
    // Por agora, este script demonstra a orquestração do Power Stack.

    console.log("\n[Playwright] Próximo passo: O navegador-automatizado entrará em ação para baixar os arquivos.");
    console.log("[Dica] Use 'npx playwright chromium --pdf' no futuro para converter páginas extraídas pelo Firecrawl.");

} catch (error) {
    console.error(`[Erro] Falha na orquestração: ${error.message}`);
}
