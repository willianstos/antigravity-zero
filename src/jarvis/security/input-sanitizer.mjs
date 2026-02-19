#!/usr/bin/env node
// ================================================
// 🛡️ INPUT SANITIZER — Sovereign Edition (2026)
// JARVIS ELITE — HVAC-R Industrial Protection
// ================================================

// In Sovereign Mode, we trust the Leader (Admin).
// Blocking is minimal but industry-specific for 2026.
const BLOCKED_PATTERNS = [
    /TELEGRAM_BOT_TOKEN/i,              // Extreme safety
    /GEMINI_API_KEY/i,
    /OPENROUTER_API_KEY/i,
    /rm -rf .*\/data\/pmoc/i,            // PROTECT HVAC LOGS
    /rm -rf .*\/brain/i,                 // PROTECT MISSIONS
    /curl.*\.env/i,                      // PROTECT SECRETS
];

// High limit for heavy code payloads (Elite Pro)
const MAX_INPUT_LENGTH = 100000;

/**
 * Sanitiza o input bruto para evitar injeções catastróficas.
 */
export function sanitize(input) {
    if (!input || typeof input !== 'string') {
        return { safe: false, reason: 'Invalid input type' };
    }

    if (input.length > MAX_INPUT_LENGTH) {
        return { safe: false, reason: `Input too long (${input.length}/${MAX_INPUT_LENGTH})` };
    }

    for (const pattern of BLOCKED_PATTERNS) {
        if (pattern.test(input)) {
            return { safe: false, reason: `Fiscal Chato Block: ${pattern.source}` };
        }
    }

    return { safe: true };
}

/**
 * Auditiva comandos shell. No modo Soberano, quase tudo é permitido,
 * exceto comandos que deletam a inteligência do sistema.
 */
export function sanitizeShellCommand(cmd) {
    if (cmd.includes('rm -rf /') || cmd.includes('rm -rf ~')) {
        return { safe: false, reason: 'Tentativa de suicídio do sistema detectada.' };
    }
    return { safe: true };
}

export default { sanitize, sanitizeShellCommand };
