/**
 * 🛰️ A2A SOVEREIGN PROTOCOL — Swarm Intelligence (2026)
 * Defines the standard for Agent-to-Agent communication.
 */

export const A2A_VERSION = '1.0.0-sovereign';

// Mapeamento de Ferramentas LLM para Agentes Internos
export const TOOL_AGENT_MAP = {
    'terminal_execute': 'terminal',
    'vision_capture': 'vision',
    'browser_action': 'browser',
    'search_research': 'perplexity'
};

// Conversão de Ferramenta para Ação de Agente
export const TRANSFORM_TOOL_CALL = (toolCall) => {
    const { name, arguments: argsRaw } = toolCall.function;
    const params = typeof argsRaw === 'string' ? JSON.parse(argsRaw) : argsRaw;

    if (name === 'terminal_execute') {
        return { agent: 'terminal', action: params.mission ? 'run' : 'shell', params };
    }
    if (name === 'vision_capture') {
        return { agent: 'vision', action: 'capture', params };
    }
    if (name === 'browser_action') {
        return { agent: 'browser', action: params.action, params: params.params || {} };
    }
    if (name === 'search_research') {
        return { agent: 'perplexity', action: 'wideSearch', params };
    }

    return null;
};

export default { A2A_VERSION, TOOL_AGENT_MAP, TRANSFORM_TOOL_CALL };
