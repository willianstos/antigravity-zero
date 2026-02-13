/**
 * 🦅 Sovereign Persistent Auth Smoke Test (Multi-Account)
 * 
 * Este script verifica a capacidade de login persistente em múltiplos serviços
 * usando as credenciais do .env para garantir que o Jarvis tem acesso Omni.
 * 
 * Emails Alvo (Tier 3/2 + Perplexity):
 * 1. willianstos@gmail.com (Líder Soberano)
 * 2. contatoalienmarketing@gmail.com (Alien Operativo)
 * 3. jgsipedro@gmail.com (Perplexity/Access)
 */

const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
const fs = require('fs');
require('dotenv').config(); // Carregar .env

const CHROME_USER_DATA_DIR = path.join(os.homedir(), '.config/google-chrome-for-testing');
const EVIDENCES_DIR = path.join(__dirname, 'persistent_auth');

if (!fs.existsSync(EVIDENCES_DIR)) fs.mkdirSync(EVIDENCES_DIR);

(async () => {
    let browser, context;

    try {
        console.log('🦅 Launching VISUAL Browser (Persistent Auth Check)...');

        // Estratégia de Contexto Persistente
        // Se este diretório já tiver sido usado para logar manualmente, os cookies estarão lá.
        // Se for novo, o script deve tentar logar (Full-Auto Login).

        context = await chromium.launchPersistentContext(CHROME_USER_DATA_DIR, {
            headless: false,
            channel: 'chrome',
            viewport: { width: 1280, height: 800 },
            slowMo: 100,
            ignoreDefaultArgs: ['--enable-automation'],
            args: ['--start-maximized', '--no-first-run', '--disable-blink-features=AutomationControlled']
        });

        const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

        // Lista de Alvos
        const TARGETS = [
            { name: 'Google_Will', url: 'https://myaccount.google.com', email: process.env.ANTIGRAVITY_WILL_USER },
            { name: 'Google_Alien', url: 'https://mail.google.com', email: process.env.ANTIGRAVITY_ALIEN_USER }, // Verificar switch account
            { name: 'Perplexity_Pedro', url: 'https://www.perplexity.ai', email: process.env.PERPLEXITY_EMAIL }
        ];

        console.log('🔍 Iniciando varredura de sessões ativas...');

        for (const target of TARGETS) {
            console.log(`\n🌐 Checking: ${target.name} (${target.url})...`);
            await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(3000); // Visual check

            // Salvar Screenshot
            const screenPath = path.join(EVIDENCES_DIR, `${target.name}.png`);
            await page.screenshot({ path: screenPath });
            console.log(`📸 Evidência salva: ${target.name}.png`);

            // Lógica de Detecção SIMPLES (Smoke Test)
            const content = await page.content();
            if (content.includes('Sign in') || content.includes('Fazer login')) {
                console.log(`⚠️  Status: DESLOGADO ou Parcial. (Necessário login manual ou automação avançada de cookies)`);
                // Futuro: Injetar automação de login aqui se //full-auto permitir (risco de 2FA)
            } else {
                console.log(`✅ Status: Sessão Ativa (Provável).`);
            }
        }

        console.log('\n🦅 Smoke Test Finalizado. Verifique a pasta "persistent_auth".');

        // Manter aberto por 10s para verificação humana final
        await page.waitForTimeout(10000);
        await context.close();

    } catch (e) {
        console.error('❌ Browser Error:', e.message);
        if (context) await context.close();
        process.exit(1);
    }
})();
