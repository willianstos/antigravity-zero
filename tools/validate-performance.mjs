import { chromium } from 'playwright';

async function validate() {
    const start = Date.now();
    console.log('🚀 Final validation starting...');
    try {
        const browser = await chromium.launch({
            headless: true,
            channel: 'chrome',
            args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        await page.goto('https://google.com', { waitUntil: 'domcontentloaded' });
        await browser.close();
        console.log(`✅ Time: ${Date.now() - start}ms (target: <3000ms)`);
    } catch (err) {
        console.error('❌ Validation failed:', err.message);
        process.exit(1);
    }
}

validate();
