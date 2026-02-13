const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_USER_DATA_DIR = path.join(os.homedir(), '.config/google-chrome-for-testing');
const AUDIO_REPORT_PATH = path.join(__dirname, 'audio_report.txt');

(async () => {
    let browser = null;
    let context = null;

    try {
        console.log('🦅 Launching VISUAL Browser (Stability Loop)...');

        // [FIX ESTABILIDADE] Não usar o diretório principal do Chrome para evitar "Lock" e crashes.
        // Copiar apenas Cookies se necessário (avançado), mas para teste clean, usar dir dedicado.
        if (!fs.existsSync(CHROME_USER_DATA_DIR)) {
            console.log('📂 Criando novo perfil limpo para automação...');
            fs.mkdirSync(CHROME_USER_DATA_DIR, { recursive: true });
        }

        // Tentar lançar com persistent context em diretório isolado
        context = await chromium.launchPersistentContext(CHROME_USER_DATA_DIR, {
            headless: false,
            channel: 'chrome',
            viewport: { width: 1280, height: 800 },
            slowMo: 50,
            ignoreDefaultArgs: ['--enable-automation'],
            args: ['--start-maximized', '--no-first-run', '--no-default-browser-check']
        });

        const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

        // [FIX LOOP RETRY] Tentar navegação com retry
        let success = false;
        let attempts = 0;

        while (!success && attempts < 3) {
            try {
                attempts++;
                console.log(`🌐 Tentativa ${attempts}: Acessando Google...`);
                await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded', timeout: 15000 });
                success = true;
            } catch (e) {
                console.log(`⚠️ Falha na tentativa ${attempts}. Retrying...`);
                await page.waitForTimeout(2000);
            }
        }

        if (!success) throw new Error("Falha crítica ao acessar Google após 3 tentativas.");

        // Busca
        const searchInput = await page.$('textarea[name="q"], input[name="q"]');
        if (searchInput) {
            await searchInput.fill('Hitachi Air Conditioning Error Codes');
            await page.keyboard.press('Enter');
            console.log('🚀 Pesquisa enviada.');
        } else {
            // Fallback direto
            console.log('⚠️ Campo de busca não encontrado. Redirecionando...');
            await page.goto('https://www.google.com/search?q=Hitachi+Air+Conditioning+Error+Codes', { waitUntil: 'domcontentloaded' });
        }

        await page.waitForTimeout(3000);

        // Screenshot
        await page.screenshot({ path: 'hitachi_stable_proof.png' });
        console.log('📸 Evidência salva: hitachi_stable_proof.png');

        fs.writeFileSync(AUDIO_REPORT_PATH, "Líder, estabilidade visual alcançada com perfil isolado.");
        console.log('🎙️ Áudio report gerado.');

        await context.close();

    } catch (e) {
        console.error('❌ Browser Stability Error:', e.message);
        if (context) await context.close();
        process.exit(1);
    }
})();
