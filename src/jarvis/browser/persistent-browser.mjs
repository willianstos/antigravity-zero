#!/usr/bin/env node
// ================================================
// 🌐 PERSISTENT BROWSER — Chrome Session Controller
// Uses the REAL Chrome profile (logged in) to avoid
// wasting API tokens. Gemini Web, Google, etc.
// ================================================

import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Chrome profile path (real user session with cookies)
const CHROME_PROFILE = process.env.CHROME_PROFILE || '/home/zappro/.config/google-chrome/Default';
const CHROME_USER_DATA = process.env.CHROME_USER_DATA || '/home/zappro/.config/google-chrome';
const PLAYWRIGHT_STATE = join(__dirname, '..', '..', '..', 'data', 'browser-state.json');

class PersistentBrowser {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    // Launch Playwright with the real Chrome profile
    async launch(profileName = 'Default') {
        const { chromium } = await import('playwright');

        // Use persistent context = keeps cookies, login sessions
        // Using user data dir allows persistent sessions
        this.context = await chromium.launchPersistentContext(CHROME_USER_DATA, {
            headless: false,        // Visible — the user SEES Jarvis working
            channel: 'chrome',      // Use installed Chrome, not Chromium
            viewport: { width: 1920, height: 1080 },
            args: [
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-blink-features=AutomationControlled',
                `--profile-directory=${profileName}`, // Select specific profile
            ],
            ignoreDefaultArgs: ['--enable-automation'],
        });

        this.page = this.context.pages()[0] || await this.context.newPage();
        console.log(`🌐 [BROWSER] Persistent session started (Profile: ${profileName})`);
        return this;
    }

    // Navigate and return page content
    async navigate(url, waitFor = 'networkidle') {
        await this.page.goto(url, { waitUntil: waitFor, timeout: 30000 });
        const title = await this.page.title();
        console.log(`🌐 [BROWSER] Navigated: ${title}`);
        return { title, url: this.page.url() };
    }

    // Screenshot
    async screenshot(filename = 'screenshot.png') {
        const path = join(__dirname, '..', '..', '..', 'artifacts', filename);
        await this.page.screenshot({ path, fullPage: false });
        return { path };
    }

    // Type in active element
    async type(text, selector) {
        if (selector) await this.page.click(selector);
        await this.page.keyboard.type(text, { delay: 30 });
    }

    // Click element
    async click(selector) {
        await this.page.click(selector, { timeout: 10000 });
    }

    // Extract text
    async extractText(selector = 'body') {
        return await this.page.textContent(selector);
    }

    // Wait for element
    async waitFor(selector, timeout = 15000) {
        return await this.page.waitForSelector(selector, { timeout });
    }

    // Get current URL
    currentUrl() {
        return this.page?.url() || null;
    }

    // New tab
    async newTab(url) {
        const page = await this.context.newPage();
        if (url) await page.goto(url, { waitUntil: 'networkidle' });
        return page;
    }

    // Close
    async close() {
        if (this.context) await this.context.close();
        this.browser = null;
        this.context = null;
        this.page = null;
    }
}

export default PersistentBrowser;
export { PersistentBrowser };
