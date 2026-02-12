#!/usr/bin/env node
/**
 * 👁️ Vision Feed Loop - Sovereign Visual Cortex
 * Captura a tela e prepara o buffer para o Qwen2 Omni.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';
const VISION_DIR = '/home/zappro/antigravity-zero/artifacts/vision_cortex';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} VISION_CORTEX "${escapedMsg}"`);
    } catch (e) {}
}

async function startVisionFeed() {
    if (!fs.existsSync(VISION_DIR)) fs.mkdirSync(VISION_DIR, { recursive: true });
    
    logIAM("👁️ Córtex Visual Ativado. Iniciando captura de feed 1FPS...");

    // Loop infinito de captura (simulado por 10 iterações para segurança inicial)
    for (let i = 0; i < 10; i++) {
        try {
            const timestamp = Date.now();
            const filename = `cortex_frame_${timestamp}.jpg`;
            const filepath = path.join(VISION_DIR, filename);
            
            // Captura tela inteira (incluindo mouse)
            execSync(`scrot -p -q 30 ${filepath}`);
            
            // Link simbólico para 'current_view.jpg' para o vLLM/Omni consumir
            const currentView = path.join(VISION_DIR, 'current_view.jpg');
            if (fs.existsSync(currentView)) fs.unlinkSync(currentView);
            fs.symlinkSync(filepath, currentView);

            // Housekeeping: manter apenas os últimos 5 frames
            const files = fs.readdirSync(VISION_DIR).filter(f => f.endsWith('.jpg') && f !== 'current_view.jpg');
            if (files.length > 5) {
                files.sort().slice(0, files.length - 5).forEach(f => fs.unlinkSync(path.join(VISION_DIR, f)));
            }

            // logIAM(`📸 Frame capturado: ${filename}`);
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            logIAM("⚠️ Erro no Feed de Visão: " + e.message);
            break;
        }
    }
}

startVisionFeed();
