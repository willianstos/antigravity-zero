
// FILE: tools/smoke-browser.mjs
import { chromium } from '@playwright/test';

(async () => {
    console.log("🔍 Running Browser Smoke Test (via @playwright/test)...");
    try {
        console.log("🚀 Launching browser with optimized args...");
        const browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--single-process',
                '--no-zygote'
            ]
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        console.log("🌐 Navigating to example.com...");
        await page.goto('https://example.com', { timeout: 10000 });
        const title = await page.title();

        console.log(`✅ Page Title: ${title}`);

        await browser.close();
        console.log("✅ Browser validation successful.");
    } catch (error) {
        console.error("❌ Browser validation failed:", error);
        process.exit(1);
    }
})();
