#!/usr/bin/env node
/**
 * 📺 Vision Stream Bridge - Operacional Live View
 * Captura snapshots low-res e disponibiliza para o Dashboard.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';
const STREAM_DIR = '/home/zappro/antigravity-zero/artifacts/stream';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} BROADCASTER "${escapedMsg}"`);
    } catch (e) {}
}

async function startStream() {
    if (!fs.existsSync(STREAM_DIR)) fs.mkdirSync(STREAM_DIR, { recursive: true });
    
    logIAM("📺 Vision Stream Bridge Iniciado. Capturando frames do LAM...");

    try {
        // Captura de screenshot via scrot ou xwd
        const timestamp = Date.now();
        const filename = "vision_live_" + timestamp + ".jpg";
        const filepath = path.join(STREAM_DIR, filename);
        
        // Screenshot comprimida (Low-res para performance)
        execSync("scrot -q 20 " + filepath);
        
        // Limpeza de frames antigos (manter apenas o último)
        const files = fs.readdirSync(STREAM_DIR);
        files.sort().reverse().slice(1).forEach(f => {
            fs.unlinkSync(path.join(STREAM_DIR, f));
        });

        logIAM("🎯 Frame capturado: " + filename + ". Dashboard sincronizado.");
    } catch (e) {
        logIAM("⚠️ Erro ao capturar frame de visão: " + e.message);
    }
}

startStream();
