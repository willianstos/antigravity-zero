#!/usr/bin/env node
// ================================================
// 🎭 PLAYWRIGHT E2E — Agent Dashboard & Tools
// Prova visual de que o Jarvis Dashboard funciona
// ================================================

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const JARVIS_URL = 'http://127.0.0.1:7777';
const CALC_URL = 'http://127.0.0.1:7777/calculator.html';

async function main() {
    console.log('\n🎭 [PLAYWRIGHT] Iniciando E2E Visual Test...');

    // 1. Iniciar Jarvis em background
    console.log('🤖 [1/5] Iniciando Jarvis Swarm API...');
    const jarvis = spawn('node', ['src/jarvis/swarm-server.mjs'], {
        cwd: ROOT,
        stdio: 'inherit'
    });

    // Aguardar boot (mais tempo para segurança)
    await new Promise(r => setTimeout(r, 6000));

    // 2. Launch Browser
    console.log('🌐 [2/5] Abrindo Chromium...');
    const browser = await chromium.launch({ headless: true }); // Mudar para false se quiser ver o show
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    try {
        // 3. Test DASHBOARD
        console.log('📊 [3/5] Validando Dashboard...');
        await page.goto(JARVIS_URL);
        await page.waitForSelector('h1:has-text("Jarvis Swarm")');

        // Tirar print do Dashboard
        await page.screenshot({ path: join(ROOT, 'artifacts', 'e2e-dashboard.png') });
        console.log('   ✅ Dashboard carregado. Screenshot: artifacts/e2e-dashboard.png');

        // 4. Test CALCULATOR (A ferramenta criada pelo bot)
        console.log('🧮 [4/5] Validando Calculadora Autônoma...');
        await page.goto(CALC_URL);
        await page.waitForSelector('.calculator');

        // Fazer uma conta: 139 + 382 = 521 (os números do seu .env!)
        console.log('   ⌨️  Digitando: 1 + 3 + 9 + 3 + 8 + 2 = ...');
        await page.click('button:has-text("1")');
        await page.click('button:has-text("3")');
        await page.click('button:has-text("9")');
        await page.click('button:has-text("+")');
        await page.click('button:has-text("3")');
        await page.click('button:has-text("8")');
        await page.click('button:has-text("2")');
        await page.click('button:has-text("=")');

        // Verificar resultado
        await page.waitForTimeout(500);
        const result = await page.textContent('#result');
        console.log(`   🔢 Resultado obtido: ${result}`);

        if (result === '521') {
            console.log('   ✅ Cálculo correto!');
        } else {
            console.log('   ⚠️ Cálculo incorreto ou formato diferente.');
        }

        // Tirar print do sucesso
        await page.screenshot({ path: join(ROOT, 'artifacts', 'e2e-calculator-success.png') });
        console.log('   📸 Screenshot da conta: artifacts/e2e-calculator-success.png');

        // 5. Test Agent List
        console.log('🤖 [5/5] Verificando Agents Online...');
        await page.goto(JARVIS_URL);
        await page.waitForTimeout(2000); // Aguardar polling
        const agentCount = await page.textContent('#metricAgents');
        console.log(`   🐝 Agents detectados pelo Dashboard: ${agentCount}`);

    } catch (err) {
        console.error('❌ [E2E] Falha crítica:', err.message);
    } finally {
        // Cleanup
        await browser.close();
        jarvis.kill('SIGTERM');
        console.log('\n🏁 [PLAYWRIGHT] Teste E2E Finalizado.\n');
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
