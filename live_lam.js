const { chromium } = require('playwright');

(async () => {
    try {
        console.log('🦅 Launching VISUAL Browser (Headless: FALSE)...');
        // Modo AO VIVO: browser visível
        const browser = await chromium.launch({
            headless: false,
            slowMo: 50 // Adiciona delay humano entre ações
        });

        const context = await browser.newContext({
            viewport: { width: 1280, height: 800 }
        });

        const page = await context.newPage();

        console.log('🌐 Acessando Perplexity.ai AO VIVO...');
        await page.goto('https://www.perplexity.ai', { waitUntil: 'domcontentloaded' });

        // Simular comportamento humano de "olhar" a página
        await page.waitForTimeout(2000);

        console.log('⌨️  Digitando query de pesquisa...');
        // Tentar encontrar a caixa de busca (seja textarea ou input)
        // O seletor pode variar, vamos tentar uma estratégia genérica de foco
        try {
            await page.click('textarea, input[type="text"]');
            await page.keyboard.type('Qual é o stack de DevOps mais moderno em 2026?', { delay: 100 });
            await page.waitForTimeout(1000);
            await page.keyboard.press('Enter');
            console.log('🚀 Pesquisa enviada!');
        } catch (e) {
            console.log('⚠️ Não consegui digitar na busca automaticamente, mas o browser está aberto.');
        }

        console.log('👀 Mantendo navegador aberto para visualização do Líder...');
        // Manter aberto por 30 segundos para o usuário ver
        await page.waitForTimeout(30000);

        // Screenshot da resposta
        await page.screenshot({ path: 'live_perplexity_proof.png' });

        await browser.close();
        console.log('✅ Sessão Live encerrada.');

    } catch (e) {
        console.error('❌ Browser Error:', e);
        process.exit(1);
    }
})();
