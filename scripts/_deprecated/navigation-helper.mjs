// FILE: tools/navigation-helper.mjs
export async function optimizedNavigation(page, url) {
    await page.goto(url, {
        waitUntil: 'domcontentloaded', // Don't wait for networkidle
        timeout: 15000
    });

    // Wait only for critical content
    await page.waitForSelector('body', { timeout: 5000 });
}

export async function cleanup(page, context, browser) {
    await page.close();
    await context.close();
    await browser.close();
}
