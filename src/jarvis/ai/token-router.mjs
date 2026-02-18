#!/usr/bin/env node
// ================================================
// 💰 TOKEN ROUTER — Smart Model Selector (2026)
// Classifica a complexidade da tarefa e roteia
// para o modelo mais barato capaz de resolvê-la.
// Economia estimada: 50-70% nos custos de API.
// ================================================

// Modelos disponíveis por tier — UNCENSORED via OpenRouter (sem guardrails)
const MODELS = {
    // Tier 1: Tarefas simples — Dolphin Mistral 24B Venice (GRÁTIS, zero guardrails)
    FAST: process.env.MODEL_FAST || 'venice-ai/dolphin-mistral-24b-venice',
    // Tier 2: Tarefas médias — mesmo modelo (gratuito)
    BALANCED: process.env.MODEL_BALANCED || 'venice-ai/dolphin-mistral-24b-venice',
    // Tier 3: Tarefas complexas — Dolphin Mixtral 8x7B (uncensored, raciocínio profundo)
    POWER: process.env.MODEL_POWER || 'cognitivecomputations/dolphin-mixtral-8x7b',
};

// Limites de tokens por tier
const TOKEN_LIMITS = {
    FAST: { maxInput: 4000, maxOutput: 500 },
    BALANCED: { maxInput: 16000, maxOutput: 2000 },
    POWER: { maxInput: 128000, maxOutput: 8000 },
};

// Padrões que indicam tarefa SIMPLES (Tier 1)
const SIMPLE_PATTERNS = [
    /^(oi|olá|ola|hi|hello|bom dia|boa tarde|boa noite)/i,
    /^(status|ping|uptime|saúde|health)/i,
    /^(screenshot|foto|tela|captura)/i,
    /^(sim|não|nao|ok|certo|entendido)/i,
    /^(obrigad|valeu|thanks)/i,
    /^recall:/i,
    /^\/(start|jarvis|help|memory)/i,
];

// Padrões que indicam tarefa MÉDIA (Tier 2 — força BALANCED mesmo em msgs curtas)
const BALANCED_PATTERNS = [
    /analisa|analise|analyze/i,
    /explica|explain|como funciona/i,
    /código|code|script|função|function/i,
    /erro|error|bug|debug/i,
    /configura|configure|setup/i,
    /search:|busca:|pesquisa:/i,
    /resume|summarize|resumo/i,
];

// Padrões que indicam tarefa COMPLEXA (Tier 3)
const COMPLEX_PATTERNS = [
    /^(missão|mission|execute|sudo):/i,
    /refatora|refactor|arquitetura|architecture/i,
    /cria.*sistema|build.*system/i,
    /analisa.*repositório|analyze.*repo/i,
    /implementa|implement.*completo/i,
    /deploy|infraestrutura|kubernetes/i,
    /pesquisa.*profunda|deep.*research/i,
];

/**
 * Classifica a complexidade de uma mensagem e retorna o tier adequado.
 * @param {string} message - Mensagem do usuário
 * @param {number} contextTokens - Tokens estimados do contexto atual
 * @returns {{ tier: string, model: string, limits: object, reason: string }}
 */
export function classifyTask(message, contextTokens = 0) {
    if (!message) return { tier: 'FAST', model: MODELS.FAST, limits: TOKEN_LIMITS.FAST, reason: 'empty input' };

    const msg = message.trim();

    // Verifica padrões simples primeiro
    for (const pattern of SIMPLE_PATTERNS) {
        if (pattern.test(msg)) {
            return { tier: 'FAST', model: MODELS.FAST, limits: TOKEN_LIMITS.FAST, reason: `simple pattern: ${pattern.source}` };
        }
    }

    // Verifica padrões complexos
    for (const pattern of COMPLEX_PATTERNS) {
        if (pattern.test(msg)) {
            return { tier: 'POWER', model: MODELS.POWER, limits: TOKEN_LIMITS.POWER, reason: `complex pattern: ${pattern.source}` };
        }
    }

    // Verifica padrões médios (BALANCED) — antes da heurística de tamanho
    for (const pattern of BALANCED_PATTERNS) {
        if (pattern.test(msg)) {
            return { tier: 'BALANCED', model: MODELS.BALANCED, limits: TOKEN_LIMITS.BALANCED, reason: `balanced pattern: ${pattern.source}` };
        }
    }

    // Heurística por tamanho da mensagem
    if (msg.length < 80 && contextTokens < 2000) {
        return { tier: 'FAST', model: MODELS.FAST, limits: TOKEN_LIMITS.FAST, reason: 'short message + small context' };
    }

    if (msg.length > 300 || contextTokens > 8000) {
        return { tier: 'POWER', model: MODELS.POWER, limits: TOKEN_LIMITS.POWER, reason: 'long message or large context' };
    }

    // Default: BALANCED
    return { tier: 'BALANCED', model: MODELS.BALANCED, limits: TOKEN_LIMITS.BALANCED, reason: 'default balanced' };
}

/**
 * Estima tokens de uma string (aproximação: 1 token ≈ 4 chars em PT/EN)
 * @param {string} text
 * @returns {number}
 */
export function estimateTokens(text = '') {
    return Math.ceil(text.length / 4);
}

/**
 * Retorna o custo estimado em USD para uma chamada
 * @param {string} tier
 * @param {number} inputTokens
 * @param {number} outputTokens
 * @returns {number} custo em USD
 */
export function estimateCost(tier, inputTokens, outputTokens) {
    // Preços aproximados Grok via OpenRouter (por 1M tokens)
    const PRICES = {
        FAST: { input: 0.30, output: 0.50 },   // Grok Mini
        BALANCED: { input: 3.00, output: 15.00 },  // Grok 3
        POWER: { input: 3.00, output: 15.00 },  // Grok 3 (full context)
    };
    const p = PRICES[tier] || PRICES.BALANCED;
    return ((inputTokens * p.input) + (outputTokens * p.output)) / 1_000_000;
}

export default { classifyTask, estimateTokens, estimateCost, MODELS };
