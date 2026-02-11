import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '../../../../');
const envPath = path.join(rootDir, '.env');

// Parse arguments
const args = process.argv.slice(2);
const queryIndex = args.indexOf('--query');
const isDeep = args.includes('--deep');
const query = queryIndex !== -1 ? args[queryIndex + 1] : null;

if (!query) {
    console.error('Error: --query is required');
    process.exit(1);
}

// Simple .env parser
const env = {};
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
}

const EMAIL = env.PERPLEXITY_EMAIL;
const PASSWORD = env.PERPLEXITY_PASSWORD;
const USER_DATA_DIR = path.join(process.env.HOME, 'pw-profiles/perplexity');

async function run() {
    console.log(`Starting Perplexity research from ${process.cwd()}`);
    console.log(`Query: "${query}" (Deep: ${isDeep})`);

    const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
        headless: true, // Run headless for skill automation
        args: ['--disable-blink-features=AutomationControlled']
    });

    const page = await context.newPage();

    try {
        console.log('Navigating to Perplexity...');
        await page.goto('https://www.perplexity.ai/', { waitUntil: 'networkidle' });

        const timestamp = new Date().getTime();

        // Check for login indicators instead of auto-filling
        const emailInput = page.getByPlaceholder(/email/i);
        const loginTrigger = page.getByRole('button', { name: /sign in|log in|continuar/i }).first();

        const needsLogin = await emailInput.isVisible({ timeout: 5000 }).catch(() => false) ||
            await loginTrigger.isVisible({ timeout: 2000 }).catch(() => false);

        if (needsLogin) {
            console.error('\n[!] ERRO DE AUTENTICAÇÃO: Sessão não detectada ou expirada.');
            console.error('De acordo com as regras de segurança (H2 - Soberania), não automatizamos o login.');
            console.error('Por favor, siga estas instruções para renovar sua sessão:');
            console.error('1. Execute: npx playwright codegen --user-data-dir=$HOME/pw-profiles/perplexity https://www.perplexity.ai/');
            console.error('2. Faça o login manualmente na janela que abrir.');
            console.error('3. Feche o navegador e execute este comando novamente.\n');

            await page.screenshot({ path: path.join(rootDir, `artifacts/auth-required-${timestamp}.png`) });
            process.exit(1);
        }

        await page.screenshot({ path: path.join(rootDir, `artifacts/debug-load-${timestamp}.png`) });

        // Check for and close login modal if present
        const closeBtn = page.locator('button:has(.fa-xmark), button:has-text("✕"), [aria-label="Close"]').first();
        if (await closeBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log('Closing login modal...');
            await closeBtn.click();
            await page.waitForTimeout(1000);
        }

        // Check if we need to click a "Sign in" button first to see the form (though usually it's a modal)

        // Perform Search
        console.log('Searching for input field...');
        const searchInput = page.locator('textarea, [contenteditable="true"], [placeholder*="Ask any"]').first();

        if (!(await searchInput.isVisible({ timeout: 10000 }).catch(() => false))) {
            console.log('Input field not visible. Taking error screenshot...');
            await page.screenshot({ path: path.join(rootDir, `artifacts/debug-error-${timestamp}.png`) });
        }

        await searchInput.waitFor({ state: 'visible', timeout: 20000 });
        await searchInput.fill(query);
        await page.waitForTimeout(500);
        await page.keyboard.press('Enter');
        console.log('Query submitted. Waiting for response...');

        // Wait for response text to start appearing
        const responseLocator = page.locator('.prose, [class*="prose"]').first();
        await responseLocator.waitFor({ state: 'visible', timeout: 30000 });

        // Heuristic: wait for the sharing or feedback buttons which appear at the end
        await page.waitForTimeout(15000);

        // Extract result
        const result = await responseLocator.innerText();
        console.log('\n--- RESEARCH RESULT ---\n');
        console.log(result);
        console.log('\n--- END OF RESULT ---\n');

        const finalScreenshotPath = path.join(rootDir, `artifacts/perplexity-result-${timestamp}.png`);
        await page.screenshot({ path: finalScreenshotPath, fullPage: true });
        console.log(`Detailed screenshot saved to ${finalScreenshotPath}`);

    } catch (error) {
        console.error('An error occurred during research:', error);
        const errorTimestamp = new Date().getTime();
        await page.screenshot({ path: path.join(rootDir, `artifacts/debug-exception-${errorTimestamp}.png`) });
    } finally {
        await context.close();
    }
}

run();
