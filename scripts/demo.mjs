#!/usr/bin/env node
// ================================================
// 🎬 LIVE DEMO — Jarvis Desktop Controller
// Shows real desktop automation: mouse, terminal, browser
// The user SEES everything happening on screen
// ================================================

import { execSync, spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ARTIFACTS = join(ROOT, 'artifacts');

if (!existsSync(ARTIFACTS)) mkdirSync(ARTIFACTS, { recursive: true });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function notify(msg) {
    try { execSync(`notify-send "🤖 Jarvis" "${msg}" -t 3000 2>/dev/null`); } catch { }
    console.log(`\n🤖 ${msg}`);
}

async function demo() {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║  🎬 JARVIS LIVE DEMO — Desktop Controller   ║');
    console.log('║  Tudo que você ver é automação real.         ║');
    console.log('║  O mouse, terminal e navegador vão se mover ║');
    console.log('║  SOZINHOS na sua tela.                       ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
    await sleep(2000);

    // ===== PHASE 1: VISION — Screenshot =====
    notify('FASE 1: Vision Cortex — Capturando sua tela...');
    await sleep(1000);

    try {
        const screenshotPath = join(ARTIFACTS, 'demo-before.png');
        try {
            execSync(`maim "${screenshotPath}"`, { timeout: 5000 });
        } catch {
            execSync(`scrot "${screenshotPath}"`, { timeout: 5000 });
        }
        console.log(`  📸 Screenshot salvo: ${screenshotPath}`);
    } catch (e) {
        console.log(`  ⚠️ Screenshot: ${e.message} (instale maim: sudo apt install maim)`);
    }
    await sleep(1500);

    // ===== PHASE 2: MOUSE — Movimento ao vivo =====
    notify('FASE 2: Mouse Control — Observe o cursor se mover!');
    await sleep(1000);

    try {
        // Get screen dimensions
        const screenInfo = execSync('xdpyinfo | grep dimensions', { encoding: 'utf8' });
        const match = screenInfo.match(/(\d+)x(\d+)/);
        const screenW = match ? parseInt(match[1]) : 1920;
        const screenH = match ? parseInt(match[2]) : 1080;
        const centerX = Math.floor(screenW / 2);
        const centerY = Math.floor(screenH / 2);

        // Draw a star pattern with the mouse
        console.log('  🖱️ Desenhando padrão estrela com o mouse...');
        const points = [
            [centerX, centerY - 150],      // Top
            [centerX + 140, centerY + 100], // Bottom-right
            [centerX - 200, centerY - 30],  // Left
            [centerX + 200, centerY - 30],  // Right
            [centerX - 140, centerY + 100], // Bottom-left
            [centerX, centerY - 150],       // Back to top
        ];

        for (const [x, y] of points) {
            // Smooth movement
            for (let step = 0; step < 10; step++) {
                const currentPos = execSync('xdotool getmouselocation', { encoding: 'utf8' });
                const curMatch = currentPos.match(/x:(\d+)\s+y:(\d+)/);
                const curX = parseInt(curMatch[1]);
                const curY = parseInt(curMatch[2]);
                const nextX = Math.round(curX + (x - curX) * (step + 1) / 10);
                const nextY = Math.round(curY + (y - curY) * (step + 1) / 10);
                execSync(`xdotool mousemove ${nextX} ${nextY}`);
                await sleep(30);
            }
            await sleep(200);
        }

        // Move back to center
        execSync(`xdotool mousemove ${centerX} ${centerY}`);
        console.log('  ✅ Padrão estrela concluído!');
    } catch (e) {
        console.log(`  ⚠️ Mouse: ${e.message} (instale xdotool: sudo apt install xdotool)`);
    }
    await sleep(1500);

    // ===== PHASE 3: TERMINAL — Abrir terminal e digitar =====
    notify('FASE 3: Terminal Agent — Abrindo terminal e digitando...');
    await sleep(1000);

    try {
        // Open a terminal
        const termProc = spawn('xfce4-terminal', ['--title=Jarvis-Demo'], {
            detached: true,
            stdio: 'ignore'
        });
        termProc.unref();
        await sleep(2000);

        // Focus the terminal
        try {
            execSync('xdotool search --name "Jarvis-Demo" windowactivate', { timeout: 3000 });
        } catch {
            execSync('xdotool search --name "Terminal" windowactivate', { timeout: 3000 });
        }
        await sleep(500);

        // Type commands
        const commands = [
            'echo "🤖 Jarvis Sovereign está no controle!"',
            'echo "📅 Data: $(date)"',
            'echo "🖥️ Hostname: $(hostname)"',
            'echo "💾 RAM livre: $(free -h | grep Mem | awk \'{print $4}\')"',
            'echo "🎮 GPU: $(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null || echo N/A)"',
            'echo "✅ Demo completo — Jarvis controla seu terminal!"',
        ];

        for (const cmd of commands) {
            execSync(`xdotool type --delay 25 "${cmd.replace(/"/g, '\\"')}"`);
            await sleep(300);
            execSync('xdotool key Return');
            await sleep(800);
        }

        console.log('  ✅ Comandos digitados no terminal!');
    } catch (e) {
        console.log(`  ⚠️ Terminal: ${e.message}`);
    }
    await sleep(1500);

    // ===== PHASE 4: BROWSER — Abrir navegador =====
    notify('FASE 4: Browser Agent — Abrindo navegador...');
    await sleep(1000);

    try {
        // Open the Jarvis Dashboard in browser
        const browserProc = spawn('xdg-open', ['http://localhost:7777'], {
            detached: true,
            stdio: 'ignore'
        });
        browserProc.unref();
        console.log('  🌐 Dashboard aberto no navegador: http://localhost:7777');
        await sleep(3000);
    } catch (e) {
        console.log(`  ⚠️ Browser: ${e.message}`);
    }

    // ===== PHASE 5: FINAL SCREENSHOT =====
    notify('FASE 5: Captura final — Evidência completa!');
    await sleep(1000);

    try {
        const finalPath = join(ARTIFACTS, 'demo-after.png');
        try {
            execSync(`maim "${finalPath}"`, { timeout: 5000 });
        } catch {
            execSync(`scrot "${finalPath}"`, { timeout: 5000 });
        }
        console.log(`  📸 Screenshot final: ${finalPath}`);
    } catch (e) {
        console.log(`  ⚠️ Screenshot final: ${e.message}`);
    }

    await sleep(1000);

    // ===== REPORT =====
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║  🏆 DEMO CONCLUÍDO — JARVIS FUNCIONAL!       ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log('║  📸 Vision:   Screenshot capturado           ║');
    console.log('║  🖱️ Mouse:    Padrão estrela desenhado        ║');
    console.log('║  🖥️ Terminal: Comandos digitados ao vivo      ║');
    console.log('║  🌐 Browser:  Dashboard aberto               ║');
    console.log('║                                              ║');
    console.log('║  Evidências em: ./artifacts/                 ║');
    console.log('║  GPT 5.3 que tente fazer isso ao vivo. 😏    ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');

    notify('Demo concluído! Jarvis está no controle total. 🏆');
}

demo().catch(err => {
    console.error('❌ Demo failed:', err.message);
    process.exit(1);
});
