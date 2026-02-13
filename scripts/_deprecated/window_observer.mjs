#!/usr/bin/env node
/**
 * 👁️ Window Observer - Nerve Optic
 * Captura o estado visual e envia para o Dashboard.
 */
import { execSync } from 'child_process';
import path from 'path';

// Configuração de captura (H2 - RTX 3060)
const MONITOR_INTERVAL = 3000; // 3 segundos para evitar overhead
const SCREENSHOT_PATH = '/home/zappro/antigravity-zero/artifacts/active_vision.jpg';

async function startObservation() {
    console.log("🚀 Iniciando Monitoramento de Janelas Ativas (Full Motion)...");

    setInterval(async () => {
        try {
            // 1. Tira screenshot do desktop total (DISPLAY :0)
            // Usando scrot para garantir compatibilidade total no Xubuntu
            execSync(`export DISPLAY=:0 && scrot -o -q 30 ${SCREENSHOT_PATH}`);

            // 2. Lista janelas para identificar o contexto ativo
            let activeWindow = "Desktop";
            try {
                const windows = execSync('export DISPLAY=:0 && wmctrl -l').toString();
                // Tenta pegar a última janela aberta como 'ativa' simulada
                activeWindow = windows.split('\n').filter(l => l.trim()).pop() || "Desktop";
                activeWindow = activeWindow.split('  ').pop() || "Desktop";
            } catch (e) { }

            // 3. Atualiza o Dashboard
            await updateDashboard(activeWindow, "/artifacts/active_vision.jpg");

        } catch (error) {
            // Silêncio operacional em caso de erro de frame
        }
    }, MONITOR_INTERVAL);
}

async function updateDashboard(windowTitle, imgPath) {
    try {
        await fetch('http://localhost:3000/api/update-vision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                window: windowTitle,
                timestamp: new Date().toISOString(),
                image: imgPath + "?t=" + Date.now() // Cache busting
            })
        });
    } catch (e) { }
}

startObservation();
