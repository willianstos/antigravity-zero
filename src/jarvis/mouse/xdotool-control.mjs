#!/usr/bin/env node
// ================================================
// 🖱️ MOUSE CONTROL — X11 Desktop Automation
// Controls mouse, keyboard, and windows via xdotool
// ================================================

import { execSync } from 'child_process';

class DesktopControl {
    // Move mouse to absolute position
    async moveTo({ x, y }) {
        execSync(`xdotool mousemove ${x} ${y}`);
        return { success: true, action: 'moveTo', x, y };
    }

    // Click at current position or specified coords
    async click({ x, y, button = 1 } = {}) {
        if (x !== undefined && y !== undefined) {
            execSync(`xdotool mousemove ${x} ${y}`);
        }
        execSync(`xdotool click ${button}`);
        return { success: true, action: 'click', x, y, button };
    }

    // Double click
    async doubleClick({ x, y } = {}) {
        if (x !== undefined && y !== undefined) {
            execSync(`xdotool mousemove ${x} ${y}`);
        }
        execSync(`xdotool click --repeat 2 --delay 100 1`);
        return { success: true, action: 'doubleClick', x, y };
    }

    // Type text
    async type({ text, delay = 12 }) {
        execSync(`xdotool type --delay ${delay} "${text.replace(/"/g, '\\"')}"`);
        return { success: true, action: 'type', length: text.length };
    }

    // Press key combination (e.g., 'ctrl+c', 'alt+Tab')
    async key({ combo }) {
        execSync(`xdotool key ${combo}`);
        return { success: true, action: 'key', combo };
    }

    // Get current mouse position
    async getPosition() {
        const out = execSync('xdotool getmouselocation', { encoding: 'utf8' }).trim();
        const match = out.match(/x:(\d+)\s+y:(\d+)/);
        return {
            success: true,
            x: parseInt(match[1]),
            y: parseInt(match[2]),
            raw: out
        };
    }

    // Focus a window by name
    async focusWindow({ name }) {
        try {
            execSync(`xdotool search --name "${name}" windowactivate`);
            return { success: true, action: 'focusWindow', name };
        } catch {
            return { success: false, error: `Window "${name}" not found` };
        }
    }

    // Scroll
    async scroll({ direction = 'down', clicks = 3 }) {
        const button = direction === 'up' ? 4 : 5;
        execSync(`xdotool click --repeat ${clicks} ${button}`);
        return { success: true, action: 'scroll', direction, clicks };
    }

    // Check deps
    async check() {
        try {
            execSync('which xdotool', { stdio: 'ignore' });
            return { installed: true };
        } catch {
            return { installed: false };
        }
    }
}

const control = new DesktopControl();
export default control;
export const moveTo = (p) => control.moveTo(p);
export const click = (p) => control.click(p);
export const doubleClick = (p) => control.doubleClick(p);
export const type = (p) => control.type(p);
export const key = (p) => control.key(p);
export const getPosition = () => control.getPosition();
export const focusWindow = (p) => control.focusWindow(p);
export const scroll = (p) => control.scroll(p);
export const check = () => control.check();
