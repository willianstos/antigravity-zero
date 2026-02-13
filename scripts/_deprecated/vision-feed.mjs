#!/usr/bin/env node
/**
 * 👁️ Vision Feed Master (PH-MAX)
 * Captura o desktop do H2 e alimenta o Omni Cortex (Dashboard).
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DASHBOARD_URL = 'http://localhost:3000/api/update-vision';
const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} OMNI_EYE "${escapedMsg}"`);
    } catch (e) { }
}

async function captureAndSend() {
    const tmpFile = `/tmp/vision_feed_${Date.now()}.jpg`;

    try {
        // Captura com qualidade controlada p/ não saturar banda
        execSync(`export DISPLAY=:0 && scrot -q 30 ${tmpFile}`);

        const bitmap = fs.readFileSync(tmpFile);
        const base64 = `data:image/jpeg;base64,${bitmap.toString('base64')}`;

        // Identifica janela ativa (Higiene de contexto)
        let activeWindow = "Desktop";
        try {
            activeWindow = execSync("export DISPLAY=:0 && xdotool getactivewindow getwindowname").toString().trim();
        } catch (e) { }

        const payload = {
            window: activeWindow,
            timestamp: new Date().toISOString(),
            image: base64
        };

        const response = await fetch(DASHBOARD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // logIAM(`✅ Frame enviado: ${activeWindow}`);
        }

        // Cleanup
        if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);

    } catch (e) {
        logIAM(`❌ Falha no Vision Feed: ${e.message}`);
    }
}

logIAM("👁️ Vision Feed ativado. Sincronizando H2 com Omni Cortex...");

// Loop de 5 segundos para manter a fluidez sem sobrecarga
setInterval(captureAndSend, 5000);
captureAndSend();
