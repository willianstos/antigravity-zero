const { chromium } = require('playwright');
const path = require('path');
const os = require('os');

// --- [CONFIGURAÇÃO SOBERANA] ---
// Caminho do profile persistente do Chrome no Linux
// Isso permite que o browser abra JÁ LOGADO com os cookies da sua sessão normal
const CHROME_USER_DATA_DIR = path.join(os.homedir(), '.config/google-chrome');
// ou use um diretório específico para o bot se preferir isolamento, mas copiando os cookies:
// const BOT_USER_DATA_DIR = path.join(os.homedir(), '.config/openclaw-browser-profile');

(async () => {
    try {
        console.log('🦅 Launching VISUAL Browser com PERFIL PERSISTENTE...');
        console.log(`📂 Profile Dir: ${CHROME_USER_DATA_DIR}`);

        // Lança o Chrome usando o diretório de dados do usuário (Persistent Context)
        // Nota: O Chrome original deve estar FECHADO para isso funcionar sem conflito de lock,
        // ou usamos 'channel: "chrome"' e um diretório copiado.

        // Estratégia deignição: Usar launchPersistentContext
        const context = await chromium.launchPersistentContext(CHROME_USER_DATA_DIR, {
            headless: false,
            channel: 'chrome', // Tenta usar o Chrome instalado no sistema
            viewport: { width: 1280, height: 800 },
            slowMo: 50,
            ignoreDefaultArgs: ['--enable-automation'], // Tenta esconder que é um robô
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--start-maximized'
            ]
        });

        // Pega a primeira página (que já abre com o contexto)
        const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

        console.log('🌐 Acessando Perplexity.ai (Sessão Persistente)...');
        await page.goto('https://www.perplexity.ai', { waitUntil: 'domcontentloaded' });

        // Se estiver logado, não haverá botão de "Sign Up" ou haverá avatar.
        // Vamos tentar detectar login
        console.log('🔍 Verificando estado de login...');

        // Tentar interagir assumindo que está logado
        console.log('⌨️  Tentando query com memória persistente...');

        try {
            // Foco na área de texto
            await page.click('textarea, input[type="text"]');
            await page.keyboard.type('Quais são as tendências de IA Soberana para 2026? Responda curto.', { delay: 50 });
            await page.waitForTimeout(1000);
            await page.keyboard.press('Enter');
            console.log('🚀 Pesquisa enviada (Contexto Logado)!');
        } catch (e) {
            console.log('⚠️ Falha na interação. Pode ser necessário login manual se os cookies expiraram.');
        }

        console.log('👀 Mantendo navegador aberto para o Líder conferir a sessão...');
        await page.waitForTimeout(30000); // 30s para visualização

        // Screenshot da prova
        await page.screenshot({ path: 'live_perplexity_persistent.png' });
        console.log('📸 Proof saved: live_perplexity_persistent.png');

        await context.close(); // Fecha o contexto suavemente

    } catch (e) {
        console.error('❌ Browser Error:', e.message);
        console.log('DICA: Feche o Chrome principal se ele estiver rodando para liberar o Lock do profile.');
        process.exit(1);
    }
})();
