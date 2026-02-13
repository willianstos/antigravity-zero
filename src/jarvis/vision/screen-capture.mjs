#!/usr/bin/env node
// ================================================
// 👁️ VISION CORTEX — Screen Capture + OCR
// Sees the Ubuntu desktop via scrot + tesseract
// ================================================

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = join(__dirname, '..', '..', '..', 'artifacts', 'screenshots');

class VisionCortex {
    constructor() {
        if (!existsSync(SCREENSHOTS_DIR)) mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }

    // Take full desktop screenshot
    async capture({ region = null, filename = null } = {}) {
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const file = filename || `screen-${ts}.png`;
        const path = join(SCREENSHOTS_DIR, file);

        try {
            // Try maim first (better quality), fallback to scrot
            const tool = this._detectTool();
            let cmd;

            if (region) {
                // region = { x, y, w, h }
                if (tool === 'maim') {
                    cmd = `maim -g ${region.w}x${region.h}+${region.x}+${region.y} "${path}"`;
                } else {
                    cmd = `scrot -a ${region.x},${region.y},${region.w},${region.h} "${path}"`;
                }
            } else {
                cmd = tool === 'maim' ? `maim "${path}"` : `scrot "${path}"`;
            }

            execSync(cmd, { timeout: 10000 });
            return { success: true, path, tool, timestamp: ts };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // OCR: extract text from screenshot
    async ocr({ imagePath = null, lang = 'eng+por' } = {}) {
        try {
            // If no path, take screenshot first
            if (!imagePath) {
                const shot = await this.capture();
                if (!shot.success) return shot;
                imagePath = shot.path;
            }

            const text = execSync(
                `tesseract "${imagePath}" stdout -l ${lang} 2>/dev/null`,
                { encoding: 'utf8', timeout: 30000 }
            ).trim();

            return { success: true, text, source: imagePath, charCount: text.length };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // Get active window info
    async activeWindow() {
        try {
            const windowId = execSync('xdotool getactivewindow', { encoding: 'utf8' }).trim();
            const windowName = execSync(`xdotool getactivewindow getwindowname`, { encoding: 'utf8' }).trim();
            const geometry = execSync(`xdotool getactivewindow getwindowgeometry`, { encoding: 'utf8' }).trim();

            return { success: true, windowId, windowName, geometry };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    _detectTool() {
        try { execSync('which maim', { stdio: 'ignore' }); return 'maim'; } catch { }
        try { execSync('which scrot', { stdio: 'ignore' }); return 'scrot'; } catch { }
        throw new Error('No screenshot tool found. Install: sudo apt install maim');
    }

    // Check if vision deps are installed
    async check() {
        const deps = {};
        for (const tool of ['maim', 'scrot', 'tesseract', 'xdotool']) {
            try {
                execSync(`which ${tool}`, { stdio: 'ignore' });
                deps[tool] = true;
            } catch {
                deps[tool] = false;
            }
        }
        return deps;
    }
}

const cortex = new VisionCortex();
export default cortex;
export const capture = (p) => cortex.capture(p);
export const ocr = (p) => cortex.ocr(p);
export const activeWindow = () => cortex.activeWindow();
export const check = () => cortex.check();
