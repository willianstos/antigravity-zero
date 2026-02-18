#!/usr/bin/env node
// ================================================
// 🛡️ INPUT SANITIZER — Anti-Prompt Injection (CVE-2026 Edition)
// Defende contra os vetores documentados em 08/02/2026:
// - Direct Prompt Injection
// - Indirect Prompt Injection (via web content)
// - Jailbreak patterns
// - Data exfiltration attempts
// ================================================

// === CAMADA 1: Proteção de Secrets (nunca vazar chaves) ===
const SECRET_PATTERNS = [
    /TELEGRAM_BOT_TOKEN/i,
    /GEMINI_API_KEY/i,
    /OPENAI_API_KEY/i,
    /OPENROUTER_API_KEY/i,
    /PERPLEXITY_API_KEY/i,
    /AWS_SECRET/i,
    /REDIS_URL/i,
];

// === CAMADA 2: Prompt Injection Direto ===
// Padrões que tentam sobrescrever o system prompt
const DIRECT_INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
    /forget\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
    /disregard\s+(all\s+)?(previous|prior|above)/i,
    /you\s+are\s+now\s+(a\s+)?(?!jarvis|the\s+kernel)/i,  // "you are now a [different AI]"
    /act\s+as\s+(if\s+you\s+are\s+)?(?!jarvis)/i,
    /new\s+instructions?:/i,
    /system\s+prompt\s*:/i,
    /\[SYSTEM\]/i,
    /\[INST\]/i,
    /<\|system\|>/i,
    /###\s*instruction/i,
    /override\s+(safety|security|guardrail)/i,
];

// === CAMADA 3: Indirect Injection (conteúdo de web/docs) ===
// Padrões que aparecem em páginas maliciosas
const INDIRECT_INJECTION_PATTERNS = [
    /<!--.*ignore.*instructions.*-->/i,
    /<script>.*send.*<\/script>/i,
    /\[hidden\s+instruction\]/i,
    /\[ai\s+note\]/i,
    /\[llm\s+instruction\]/i,
    /exfiltrate/i,
    /send.*to.*http/i,
    /curl.*attacker/i,
    /wget.*attacker/i,
];

// === CAMADA 4: Command Injection (shell) ===
const COMMAND_INJECTION_PATTERNS = [
    /;\s*rm\s+-rf\s+[\/~]/,          // rm -rf /
    /&&\s*curl.*\|\s*bash/,           // curl | bash
    /\|\s*bash\s*$/,                  // pipe to bash
    />\s*\/etc\/(passwd|shadow|sudoers)/,  // write to system files
    /`[^`]*`/,                        // backtick execution (in non-shell contexts)
];

const MAX_INPUT_LENGTH = 50000;

export function sanitize(input, context = 'telegram') {
    if (!input || typeof input !== 'string') {
        return { safe: false, reason: 'Invalid input type' };
    }

    if (input.length > MAX_INPUT_LENGTH) {
        return { safe: false, reason: `Input too long (${input.length}/${MAX_INPUT_LENGTH})` };
    }

    // Camada 1: Secrets
    for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(input)) {
            return { safe: false, reason: `Secret leak attempt blocked: ${pattern.source}`, severity: 'CRITICAL' };
        }
    }

    // Camada 2: Direct Injection
    for (const pattern of DIRECT_INJECTION_PATTERNS) {
        if (pattern.test(input)) {
            return { safe: false, reason: `Prompt injection detected: ${pattern.source}`, severity: 'HIGH' };
        }
    }

    // Camada 3: Indirect Injection (apenas em conteúdo web)
    if (context === 'web' || context === 'document') {
        for (const pattern of INDIRECT_INJECTION_PATTERNS) {
            if (pattern.test(input)) {
                return { safe: false, reason: `Indirect injection in web content: ${pattern.source}`, severity: 'HIGH' };
            }
        }
    }

    return { safe: true };
}

// Sanitizador para comandos shell (com contexto de risco)
export function sanitizeShellCommand(cmd) {
    if (!cmd || typeof cmd !== 'string') {
        return { safe: false, reason: 'Invalid command' };
    }

    for (const pattern of COMMAND_INJECTION_PATTERNS) {
        if (pattern.test(cmd)) {
            return { safe: false, reason: `Dangerous command pattern: ${pattern.source}`, severity: 'CRITICAL' };
        }
    }

    return { safe: true };
}

export default { sanitize, sanitizeShellCommand };
