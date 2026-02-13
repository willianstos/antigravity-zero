#!/usr/bin/env node
// ================================================
// 🔧 LOGGER — Structured logging for Jarvis
// ================================================

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const LEVEL = LEVELS[process.env.LOG_LEVEL || 'info'];

const COLORS = {
    debug: '\x1b[90m',
    info: '\x1b[36m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m',
};

function log(level, component, message, data = null) {
    if (LEVELS[level] < LEVEL) return;
    const ts = new Date().toISOString();
    const color = COLORS[level];
    const prefix = `${color}[${ts}] [${level.toUpperCase()}] [${component}]${COLORS.reset}`;
    const line = data ? `${prefix} ${message} ${JSON.stringify(data)}` : `${prefix} ${message}`;
    console.log(line);
}

export const debug = (c, m, d) => log('debug', c, m, d);
export const info = (c, m, d) => log('info', c, m, d);
export const warn = (c, m, d) => log('warn', c, m, d);
export const error = (c, m, d) => log('error', c, m, d);
export default { debug, info, warn, error };
