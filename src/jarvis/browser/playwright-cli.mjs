#!/usr/bin/env node
// ================================================
// 🌐 BROWSER CONTROLLER — Playwright CLI Integration
// Full browser automation: navigate, click, extract, screenshot
// ================================================

import { execSync, spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTIFACTS = join(__dirname, '..', '..', '..', 'artifacts');

class BrowserController {
    constructor() {
        this.userDataDir = join(process.env.HOME || '/home/zappro', '.config', 'google-chrome-for-testing');
    }

    // Navigate to URL and get page content
    async navigate({ url, waitFor = 3000 }) {
        const script = `
      const { chromium } = require('playwright');
      (async () => {
        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('${url}', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(${waitFor});
        const title = await page.title();
        const content = await page.textContent('body');
        console.log(JSON.stringify({ title, url: page.url(), contentLength: content.length }));
        await browser.close();
      })();
    `;
        return this._runScript(script);
    }

    // Take browser screenshot
    async screenshot({ url, filename = 'browser-shot.png' }) {
        const outPath = join(ARTIFACTS, filename);
        if (!existsSync(ARTIFACTS)) mkdirSync(ARTIFACTS, { recursive: true });

        const script = `
      const { chromium } = require('playwright');
      (async () => {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('${url}', { waitUntil: 'networkidle', timeout: 30000 });
        await page.screenshot({ path: '${outPath}', fullPage: true });
        console.log(JSON.stringify({ success: true, path: '${outPath}' }));
        await browser.close();
      })();
    `;
        return this._runScript(script);
    }

    // Click element on page
    async clickElement({ url, selector, waitFor = 2000 }) {
        const script = `
      const { chromium } = require('playwright');
      (async () => {
        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('${url}', { waitUntil: 'domcontentloaded' });
        await page.click('${selector}');
        await page.waitForTimeout(${waitFor});
        console.log(JSON.stringify({ success: true, clicked: '${selector}' }));
        await browser.close();
      })();
    `;
        return this._runScript(script);
    }

    // Extract data from page
    async extract({ url, selector = 'body', attribute = 'textContent' }) {
        const script = `
      const { chromium } = require('playwright');
      (async () => {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('${url}', { waitUntil: 'domcontentloaded', timeout: 30000 });
        const elements = await page.$$eval('${selector}', (els) => 
          els.map(el => ({ text: el.textContent?.trim(), href: el.href || null })).slice(0, 50)
        );
        console.log(JSON.stringify({ success: true, count: elements.length, elements }));
        await browser.close();
      })();
    `;
        return this._runScript(script);
    }

    async _runScript(script) {
        try {
            const result = execSync(`node -e "${script.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
                encoding: 'utf8',
                timeout: 60000,
                cwd: join(__dirname, '..', '..', '..')
            });
            return JSON.parse(result.trim());
        } catch (err) {
            return { success: false, error: err.message?.substring(0, 500) };
        }
    }

    async check() {
        try {
            const version = execSync('npx playwright --version 2>/dev/null', { encoding: 'utf8' }).trim();
            return { installed: true, version };
        } catch {
            return { installed: false, version: null };
        }
    }
}

const browser = new BrowserController();
export default browser;
export const navigate = (p) => browser.navigate(p);
export const screenshot = (p) => browser.screenshot(p);
export const clickElement = (p) => browser.clickElement(p);
export const extract = (p) => browser.extract(p);
export const check = () => browser.check();
