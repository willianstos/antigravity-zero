const { chromium } = require('playwright');

(async () => {
    try {
        console.log('🦅 Launching Browser (Headless: true)...');
        const browser = await chromium.launch({ headless: true });

        // Simular um contexto realista (Desktop 1920x1080)
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const page = await context.newPage();

        console.log('🌐 Navigating to Daikin Global...');
        // Usar site global para garantir estabilidade
        await page.goto('https://www.daikin.com', { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Simular movimento humano do mouse
        console.log('🖱️ Simulating Mouse Movement...');
        await page.mouse.move(100, 100);
        await page.waitForTimeout(200);
        await page.mouse.move(500, 300);
        await page.waitForTimeout(200);

        // Tentar encontrar um link de produto ou solução
        // Estratégia resiliente: procurar qualquer link relevante
        const link = await page.$('a[href*="products"], a[href*="solution"]');

        if (link) {
            console.log('🔗 Found Product/Solution link. Clicking...');
            const box = await link.boundingBox();
            if (box) {
                // Mover mouse até o link antes de clicar (LAM behavior)
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                await page.waitForTimeout(500);
                await link.click();
                console.log('✅ Clicked.');
                await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => { });
            }
        } else {
            console.log('⚠️ Specific link not found. Capturing homepage.');
        }

        // Screenshot final
        const screenshotPath = 'daikin_lam_proof.png';
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`📸 Screenshot saved to: ${screenshotPath}`);

        await browser.close();
    } catch (e) {
        console.error('❌ Browser Error:', e);
        process.exit(1);
    }
})();
