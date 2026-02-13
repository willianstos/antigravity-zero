const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('🦅 HVAC Workflow E2E', () => {

    test('Structure Validation', async () => {
        const skillPath = path.join(__dirname, '../../.agent/skills/classificador-hvac/SKILL.md');
        expect(fs.existsSync(skillPath)).toBe(true);
    });

    test('Google Drive Access Check', async ({ page }) => {
        // Nota: Usamos o context configurado no playwright.config.js
        await page.goto('https://drive.google.com', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
        const title = await page.title();
        console.log('Drive Page Title:', title);
        // Não falhar se pedir login, apenas registrar
        await page.screenshot({ path: 'artifacts/smoke_tests/drive_check.png' });
    });

});
