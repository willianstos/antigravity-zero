#!/usr/bin/env node
// ================================================
// 🧠 GEMINI WEB — Deep Research via Browser
// Uses logged-in Gemini Pro session (NO API tokens!)
// Navigates gemini.google.com with real Chrome profile
// ================================================

import PersistentBrowser from './persistent-browser.mjs';

const GEMINI_URL = 'https://gemini.google.com/app';

class GeminiWeb {
    constructor() {
        this.browser = null;
        this.page = null;
        this.ready = false;
    }

    async init({ profile = 'willian' } = {}) {
        // Handle string logic just in case, but prefer object
        const p = (typeof profile === 'object') ? profile.profile : profile;

        this.browser = new PersistentBrowser();

        // Select Chrome profile directory
        // Default = Primary (Willian)
        // Profile 1 = Student (Alien)
        const profileDir = (p === 'alien' || p === 'student') ? 'Profile 1' : 'Default';

        await this.browser.launch(profileDir);

        // Navigate to Gemini
        await this.browser.navigate(GEMINI_URL);
        await this._waitForReady();
        this.ready = true;
        console.log(`🧠 [GEMINI-WEB] Ready — Profile: ${p} (${profileDir})`);
        return this;
    }

    // Switch Google account by relaunching browser with different profile
    async switchProfile(params) {
        const target = (typeof params === 'string') ? params : params.profile;
        if (this.browser) await this.close();
        await this._sleep(1000); // Wait for cleanup
        await this.init({ profile: target });
        return { status: 'switched', profile: target };
    }

    async _waitForReady() {
        try {
            // Wait for the Gemini input area to appear
            await this.browser.waitFor('div[contenteditable="true"], textarea, .ql-editor, [data-placeholder]', 20000);
        } catch {
            console.log('⚠️ [GEMINI-WEB] Input not found — may need to accept terms or select model');
        }
    }

    // Send a prompt to Gemini Web and get the response
    async ask({ prompt, waitMs = 30000, model = 'pro' }) {
        if (!this.ready) await this.init();

        try {
            // Find and clear the input
            const inputSelector = 'div[contenteditable="true"], textarea, .ql-editor, rich-textarea';
            await this.browser.waitFor(inputSelector, 10000);

            // Type the prompt
            await this.browser.click(inputSelector);
            await this.browser.page.keyboard.down('Control');
            await this.browser.page.keyboard.press('a');
            await this.browser.page.keyboard.up('Control');
            await this.browser.type(prompt);

            // Press Enter to submit
            await this.browser.page.keyboard.press('Enter');

            // Wait for response to appear and stabilize
            await this._sleep(3000); // Initial wait for response to start

            // Wait for response to complete (no more typing indicator)
            let lastText = '';
            let stableCount = 0;
            const maxWait = waitMs;
            const startTime = Date.now();

            while (stableCount < 3 && (Date.now() - startTime) < maxWait) {
                await this._sleep(2000);
                try {
                    // Get the last response message
                    const responses = await this.browser.page.$$eval(
                        '.response-container, .model-response-text, [data-content-id], .markdown-main-panel',
                        els => els.map(e => e.textContent)
                    );
                    const currentText = responses[responses.length - 1] || '';

                    if (currentText === lastText && currentText.length > 10) {
                        stableCount++;
                    } else {
                        stableCount = 0;
                        lastText = currentText;
                    }
                } catch {
                    stableCount++;
                }
            }

            console.log(`🧠 [GEMINI-WEB] Response: ${lastText.length} chars`);
            return {
                text: lastText,
                model: 'gemini-pro-web',
                tokensUsed: 0, // Free! Using web session
                source: 'browser'
            };
        } catch (err) {
            console.error(`❌ [GEMINI-WEB] Error: ${err.message}`);
            return { text: '', error: err.message, tokensUsed: 0 };
        }
    }

    // Take screenshot of the Gemini conversation
    async screenshot(filename = 'gemini-response.png') {
        return await this.browser.screenshot(filename);
    }

    async close() {
        if (this.browser) await this.browser.close();
        this.ready = false;
    }

    _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
}

export default GeminiWeb;
export { GeminiWeb };
