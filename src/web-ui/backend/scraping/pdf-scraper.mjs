import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const PDF_OUT_DIR = path.resolve('artifacts/pdfs');

function isAlreadyDownloaded(pdfUrl) {
    const files = fs.readdirSync(PDF_OUT_DIR);
    // Verifica se já existe um arquivo com o hash do URL ou se o nome sugerido já existe
    // Por simplicidade, vamos apenas logar por enquanto, mas poderíamos usar um banco JSON
    return false;
}

async function downloadPDFWithPlaywright(pdfUrl) {
    console.log(`[Playwright] Fallback: Capturando download via navegador...`);
    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage();

        // Inicia o download e aguarda o evento
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.goto(pdfUrl).catch(e => console.log('Nav ignored, waiting for download...'))
        ]);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `manual-${timestamp}-${download.suggestedFilename()}`;
        const filepath = path.join(PDF_OUT_DIR, filename);

        await download.saveAs(filepath);
        console.log(`✅ [Playwright] PDF salvo via evento download: ${filename}`);
        return filepath;
    } catch (error) {
        console.error(`❌ [Playwright] Falha na captura via download: ${error.message}`);
        return null;
    } finally {
        await browser.close();
    }
}

async function extractPDFWithFirecrawl(pdfUrl) {
    console.log(`[Firecrawl] Extraindo: ${pdfUrl}...`);
    try {
        const response = await fetch('https://api.firecrawl.dev/v1/extract', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: pdfUrl })
        });

        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `extract-${timestamp}.json`;
        fs.writeFileSync(path.join(PDF_OUT_DIR, filename), JSON.stringify(data, null, 2));
        console.log(`✅ [Firecrawl] JSON salvo em: ${filename}`);
        return data;
    } catch (error) {
        console.warn(`⚠️ [Firecrawl] Erro na extração. Tentando fallback...`);
        return await downloadPDFWithPlaywright(pdfUrl);
    }
}

async function discoverAndProcess(url) {
    console.log(`🚀 [Scraper] Iniciando: ${url}`);

    // Se for link direto de PDF, pula a descoberta
    if (url.toLowerCase().endsWith('.pdf')) {
        console.log(`📄 [Scraper] URL direta detectada. Extraindo...`);
        return await extractPDFWithFirecrawl(url);
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log(`🔍 [Scraper] Explorando novos links em: ${url}`);
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });

        // Estratégia de descoberta agressiva
        const pdfLinks = await page.evaluate(() => {
            const links = new Set();

            // 1. Links diretos .pdf
            Array.from(document.querySelectorAll('a'))
                .forEach(a => {
                    const href = a.href;
                    if (href.toLowerCase().endsWith('.pdf') || a.innerText.toLowerCase().includes('pdf')) {
                        links.add(href);
                    }
                });

            // 2. Elementos com "Download" e "PDF"
            Array.from(document.querySelectorAll('button, a, span'))
                .forEach(el => {
                    const txt = el.innerText.toLowerCase();
                    if (txt.includes('download') && txt.includes('pdf')) {
                        // Se for um link, adiciona. Se for um botão, vamos precisar clicar (futuro)
                        if (el.href) links.add(el.href);
                    }
                });

            return Array.from(links);
        });

        console.log(`🔍 [Scraper] Encontrados ${pdfLinks.length} possíveis candidatos a PDF.`);

        for (const link of pdfLinks) {
            // Verifica se o link é válido
            if (link.startsWith('http')) {
                await extractPDFWithFirecrawl(link);
            }
        }

    } catch (error) {
        console.error(`❌ [Scraper] Erro geral: ${error.message}`);
    } finally {
        await browser.close();
    }
}

const target = process.argv[2];
if (!target) {
    console.log("Uso: node tools/pdf-scraper.mjs <URL>");
} else {
    discoverAndProcess(target);
}
