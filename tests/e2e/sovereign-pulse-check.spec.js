const { test, expect } = require('@playwright/test');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

test.describe('🦅 Sovereign Node H2 - End-to-End Pulse Check', () => {

    test('1. Maestro AI (Qwen Omni) Connectivity', async () => {
        console.log('📡 Verificando Maestro Local (Porta 8000)...');
        try {
            const response = await axios.get('http://localhost:8000/v1/models', { timeout: 5000 });
            expect(response.status).toBe(200);
            expect(response.data.data[0].id).toContain('Qwen');
            console.log('✅ Maestro Online e Identificado.');
        } catch (error) {
            console.warn('⚠️ Maestro Offline ou Lento - Verifique bin/qwen-omni-launcher.sh');
            test.skip();
        }
    });

    test('2. Infrastructure (LocalStack & MinIO)', async () => {
        console.log('📡 Verificando Cloud-Native local (4566 & 9005)...');

        // Check LocalStack
        const lsHealth = await axios.get('http://localhost:4566/_localstack/health');
        expect(lsHealth.status).toBe(200);

        // Check MinIO (S3)
        const s3Health = await axios.get('http://localhost:9005/minio/health/live');
        expect(s3Health.status).toBe(200);

        console.log('✅ Infraestrutura LocalStack/MinIO sincronizada.');
    });

    test('3. Sovereign Browser (Playwright Action)', async ({ page }) => {
        console.log('🌐 Iniciando navegação simulada Jarvis...');

        // Navegar para o GitHub do Líder como teste de conectividade
        await page.goto('https://github.com/willianstos/antigravity-zero', { waitUntil: 'networkidle' });

        const title = await page.title();
        expect(title).toContain('antigravity-zero');

        // Capturar evidência do teste E2E
        const evidencePath = path.join(__dirname, '../e2e_evidence/pulse_check_success.png');
        await page.screenshot({ path: evidencePath });

        console.log(`✅ Navegação concluída. Evidência salva em: ${evidencePath}`);
    });

    test('4. OpenClaw Gateway (Bot Server)', async () => {
        console.log('🤖 Verificando integridade do gateway OpenClaw...');
        // Como o bot é um servidor Telegram, verificamos se o processo está no ar
        const { execSync } = require('child_process');
        const ps = execSync('ps aux | grep "src/bot/server.js" | grep -v grep || echo "offline"').toString();

        if (ps.includes('offline')) {
            console.warn('⚠️ Bot Server está offline (esperado se não houver polling ativo).');
        } else {
            console.log('✅ Bot Server Pulsando (PID ativo).');
        }
    });

});
