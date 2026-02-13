import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function bugReproduction() {
    console.log('🐞 Starting Chromium Bug Reproduction...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        const filePath = '/home/zappro/antigravity-zero/.agent/rules/padrao_da_lingua.md';
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const content = fs.readFileSync(filePath, 'utf8');

        // Create a simple HTML page with the content to test rendering
        const htmlContent = `
      <html>
        <body>
          <pre>${content}</pre>
        </body>
      </html>
    `;

        await page.setContent(htmlContent);
        console.log('✅ Content set successfully.');

        // Take a screenshot to verify rendering
        await page.screenshot({ path: 'artifacts/bug_repro_screenshot.png' });
        console.log('📸 Screenshot captured.');

    } catch (error) {
        console.error('❌ Error reproducing bug:', error);
    } finally {
        await browser.close();
        console.log('🚪 Browser closed.');
    }
}

bugReproduction();
