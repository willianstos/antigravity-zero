#!/usr/bin/env node
// ================================================
// 📋 JARVIS LOGGER — Sovereign Structured Logging (2026)
// Levels: debug | info | warn | error
// Output: Console (colored) + File (JSON rotated)
// ================================================

import { writeFileSync, appendFileSync, existsSync, mkdirSync, renameSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_DIR = join(__dirname, '..', '..', 'logs');
const LOG_FILE = join(LOG_DIR, 'jarvis.log');
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB

if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL = LEVELS[process.env.LOG_LEVEL || 'info'];

const COLORS = {
    debug: '\x1b[90m',   // gray
    info: '\x1b[36m',   // cyan
    warn: '\x1b[33m',   // yellow
    error: '\x1b[31m',   // red
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

function rotateIfNeeded() {
    try {
        if (existsSync(LOG_FILE) && statSync(LOG_FILE).size > MAX_LOG_SIZE) {
            const rotated = `${LOG_FILE}.${Date.now()}.bak`;
            renameSync(LOG_FILE, rotated);
        }
    } catch { /* ignore rotation errors */ }
}

function formatConsole(level, module, msg) {
    const ts = new Date().toISOString().slice(11, 19);
    const color = COLORS[level] || '';
    const icon = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'info' ? '🧠' : '🔍';
    return `${COLORS.bold}${ts}${COLORS.reset} ${color}[${level.toUpperCase()}]${COLORS.reset} ${icon} [${module}] ${msg}`;
}

function formatFile(level, module, msg, data) {
    return JSON.stringify({
        ts: new Date().toISOString(),
        level,
        module,
        msg,
        ...(data ? { data } : {})
    });
}

function log(level, module, msg, data) {
    if (LEVELS[level] < MIN_LEVEL) return;

    // Console output (colored)
    console.log(formatConsole(level, module, msg));

    // File output (JSON, rotated)
    rotateIfNeeded();
    try {
        appendFileSync(LOG_FILE, formatFile(level, module, msg, data) + '\n');
    } catch { /* ignore file errors */ }
}

const logger = {
    debug: (module, msg, data) => log('debug', module, msg, data),
    info: (module, msg, data) => log('info', module, msg, data),
    warn: (module, msg, data) => log('warn', module, msg, data),
    error: (module, msg, data) => log('error', module, msg, data),
};

export default logger;
export { logger };
