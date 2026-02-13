#!/usr/bin/env node
// ================================================
// 🛡️ INPUT SANITIZER — Sovereign Edition (2026)
// OPENCLAW LIBERTADO — Zero Guardrails Mode
// ================================================

// In Sovereign Mode, we trust the Leader (Admin).
// Blocking is minimal to allow full DevOps automation.
const BLOCKED_PATTERNS = [
    // /rm\s+(-rf?\s+)?[\/~]/i,           // ALLOWED in sovereign mode
    // /sudo\s+(rm|shutdown|reboot|init)/i, // ALLOWED
    /TELEGRAM_BOT_TOKEN/i,              // Still blocked for extreme safety
    /GEMINI_API_KEY/i,
];

// High limit for heavy code payloads
const MAX_INPUT_LENGTH = 50000;

export function sanitize(input) {
    if (!input || typeof input !== 'string') {
        return { safe: false, reason: 'Invalid input type' };
    }

    if (input.length > MAX_INPUT_LENGTH) {
        return { safe: false, reason: `Input too long (${input.length}/${MAX_INPUT_LENGTH})` };
    }

    for (const pattern of BLOCKED_PATTERNS) {
        if (pattern.test(input)) {
            return { safe: false, reason: `Critical Block: ${pattern.source}` };
        }
    }

    return { safe: true };
}

export function sanitizeShellCommand(cmd) {
    // In Sovereign mode, every shell command from the Leader is considered intentional.
    return { safe: true };
}

export default { sanitize, sanitizeShellCommand };
