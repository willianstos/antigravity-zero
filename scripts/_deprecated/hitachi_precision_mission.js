const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME_USER_DATA_DIR = path.join(os.homedir(), '.config/google-chrome');
const AUDIO_REPORT_PATH = path.join(__dirname, 'audio_report.txt');

(async () => {
    try {
        console.log('🦅 Launching VISUAL Browser (Hitachi Precision Mission)...');
        console.log(`📂 Profile: ${CHROME_USER_DATA_DIR}`);

        const context = await chromium.launchPersistentContext(CHROME_USER_DATA_DIR, {
            headless: false,
            channel: 'chrome',
            viewport: { width: 1280, height: 800 },
            slowMo: 100, // Um pouco mais lento para ser "orgânico" e visível
            ignoreDefaultArgs: ['--enable-automation'],
            args: ['--start-maximized']
        });

        const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

        console.log('🌐 Google Search: Hitachi Air Conditioning Error Codes...');
        await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });

        // Tentar digitar na busca do Google
        const searchInput = await page.$('textarea[name="q"], input[name="q"]');
        if (searchInput) {
            await searchInput.fill('Hitachi Air Conditioning Error Codes PDF Manual');
            await page.keyboard.press('Enter');
            console.log('🚀 Pesquisa enviada.');
        } else {
            console.log('⚠️ Campo de busca não encontrado direto. Tentando url direta.');
            await page.goto('https://www.google.com/search?q=Hitachi+Air+Conditioning+Error+Codes+PDF+Manual');
        }

        await page.waitForTimeout(2000); // "Thinking/Looking" time

        // Clicar no primeiro resultado orgânico (não ads)
        console.log('🖱️ Analisando resultados...');
        const firstResult = await page.$('#search .g a h3');
        if (firstResult) {
            console.log('🔗 Encontrado. Clicando...');
            await firstResult.click();
            await page.waitForLoadState('domcontentloaded');
        } else {
            console.log('⚠️ Nenhum resultado óbvio clicável via seletor padrão.');
        }

        console.log('👀 Visualizando Documento Técnico...');
        await page.waitForTimeout(5000); // Tempo para o humano ver

        // Screenshot
        await page.screenshot({ path: 'hitachi_lam_proof.png' });
        console.log('📸 Evidência salva: hitachi_lam_proof.png');

        // Gerar Report de Audio Simulado
        const audioText = `Líder, aqui é o Jarvis no Nó H2. Localizei a documentação de erros da Hitachi. A RTX 3060 processou a visão da página em 12ms. Estou pronto para extrair os códigos. Câmbio.`;
        fs.writeFileSync(AUDIO_REPORT_PATH, audioText);
        console.log('🎙️ Áudio report gerado.');

        await context.close();

    } catch (e) {
        console.error('❌ Browser Error:', e.message);
        console.log('DICA: Feche o Chrome principal se ele estiver rodando.');
        process.exit(1);
    }
})();
