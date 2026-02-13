// FILE: tools/antigravity-optimized.mjs
import { chromium } from 'playwright';

export async function createOptimizedBrowser() {
    const browser = await chromium.launch({
        headless: true,
        channel: 'chrome',
        args: [
            '--no-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--single-process',
            '--disable-extensions',
            '--disable-software-rasterizer'
        ]
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        bypassCSP: true
    });

    const page = await context.newPage();

    // Block heavy resources
    await page.route('**/*', (route) => {
        const blocked = ['image', 'stylesheet', 'font', 'media'];
        if (blocked.includes(route.request().resourceType())) {
            route.abort();
        } else {
            route.continue();
        }
    });

    return { browser, context, page };
}

// Auto-restart every 2h (prevent memory leaks)
let instance;
export async function autoRestart() {
    if (instance) await instance.browser.close();
    instance = await createOptimizedBrowser();
    setTimeout(autoRestart, 2 * 60 * 60 * 1000);
}
