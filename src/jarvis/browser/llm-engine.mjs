#!/usr/bin/env node
// ================================================
// 🧠 OPENAI AGENT — LLM Engine (OpenRouter/OpenAI)
// Dev-to-Dev Protocol: Direct, Unfiltered, Root.
// ================================================

import OpenAI from 'openai';

const MANDATO_SOBERANO = `Você é o JARVIS EXEC (Dev-to-Dev). Seja direto. Sem saudações. Se bloqueado: 'Para [X] preciso de [Y]'. Execute SUDO: ou EXECUTE:. Responda apenas com o resultado técnico ou erro bruto.`;

class OpenAIAgent {
    constructor() {
        this.client = null;
        this.ready = false;
        // Padrão: Dolphin Mistral 24B Venice (GRÁTIS, uncensored)
        this.model = process.env.MODEL_BALANCED || process.env.AGENT_MODEL || 'venice-ai/dolphin-mistral-24b-venice';
        this.baseURL = 'https://openrouter.ai/api/v1';
    }

    async init() {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('API Key not found');

        this.client = new OpenAI({
            apiKey,
            baseURL: this.baseURL,
            defaultHeaders: {
                "HTTP-Referer": "https://github.com/willianstos/antigravity-zero",
                "X-Title": "Jarvis Sovereign",
            }
        });
        this.ready = true;
        console.log(`🧠 [OPENAI] Ready — Model: ${this.model}`);
        return this;
    }

    // SDR (Sovereign Dynamic Routing) — Elite Catalog 2026
    static STRATEGIES = {
        SOVEREIGN: {
            model: 'venice-ai/dolphin-mistral-24b-venice',
            desc: 'Uncensored / Zero Guardrails / Venice Privada',
            maxTokens: 4096
        },
        LOGIC_MAX: {
            model: 'meta-llama/llama-3.1-405b-instruct', // or openai/o1-mini
            desc: 'Deep Reasoning / Architecture / Complex Math',
            maxTokens: 8192
        },
        CODING: {
            model: 'anthropic/claude-3.5-sonnet',
            desc: 'Senior Software Engineer / Refactoring',
            maxTokens: 8192
        },
        FAST: {
            model: 'openai/gpt-4o-mini',
            desc: 'Quick Task / Sub-second validation',
            maxTokens: 2048
        },
        RESEARCH: {
            model: 'perplexity/sonar-deep-research',
            desc: 'Global Data / Citations / Market Analysis',
            maxTokens: 16384
        }
    };

    // A2A Tool Definitions (MCP-ready)
    static TOOLS = [
        {
            type: 'function',
            function: {
                name: 'terminal_execute',
                description: 'Executa comandos shell ou missões Aider no sistema (Root/Sovereign).',
                parameters: {
                    type: 'object',
                    properties: {
                        command: { type: 'string', description: 'O comando shell bruto (ex: ls -la)' },
                        useSudo: { type: 'boolean', description: 'Se deve usar privilégios de root.' },
                        mission: { type: 'string', description: 'Se for uma mudança de código complexa, descreva a missão para o Aider.' }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'vision_capture',
                description: 'Captura um screenshot da tela atual ou janela específica para análise visual.',
                parameters: {
                    type: 'object',
                    properties: {
                        reason: { type: 'string', description: 'Por que o screenshot está sendo tirado?' }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'browser_action',
                description: 'Interage com a web via Playwright (Navegação, busca, cliques).',
                parameters: {
                    type: 'object',
                    properties: {
                        action: { type: 'string', enum: ['navigate', 'google', 'click', 'type'], description: 'Ação a realizar.' },
                        params: { type: 'object', description: 'Parâmetros da ação (ex: url, selector, text)' }
                    },
                    required: ['action']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'search_research',
                description: 'Realiza pesquisas profundas (Wide Research) via Perplexity sonar-deep-research.',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'O tópico da pesquisa detalhada.' }
                    },
                    required: ['query']
                }
            }
        }
    ];

    async ask({ prompt, systemPrompt = '', model = null, maxTokens = 4096, useTools = true }) {
        if (!this.ready) await this.init();
        let resolvedModel = model || this.model;

        // Auto-fix for common naming aliases
        if (resolvedModel === 'claude') resolvedModel = OpenAIAgent.STRATEGIES.CODING.model;
        if (resolvedModel === 'o1') resolvedModel = OpenAIAgent.STRATEGIES.LOGIC_MAX.model;
        if (resolvedModel === 'venice' || resolvedModel === 'grok') resolvedModel = OpenAIAgent.STRATEGIES.SOVEREIGN.model;

        try {
            const reqPayload = {
                model: resolvedModel,
                messages: [
                    { role: 'system', content: systemPrompt || MANDATO_SOBERANO },
                    { role: 'user', content: prompt }
                ],
                max_tokens: maxTokens,
                temperature: 0,
            };

            if (useTools) reqPayload.tools = OpenAIAgent.TOOLS;

            const response = await this.client.chat.completions.create(reqPayload);

            const message = response.choices[0].message;
            const text = message.content || '';
            const toolCalls = message.tool_calls || [];

            console.log(`🧠 [LLM] ${resolvedModel}: ${text.length} chars | ${toolCalls.length} tool calls`);
            return { text, model: resolvedModel, toolCalls };
        } catch (err) {
            console.error(`❌ [LLM] Error: ${err.message}`);
            return { text: '', error: err.message };
        }
    }

    // Dynamic Routing Heuristics
    async dynamicRoute({ prompt, ...params }) {
        let strategy = OpenAIAgent.STRATEGIES.FAST;

        const p = prompt.toLowerCase();
        if (p.includes('arquitetura') || p.includes('refactor') || p.includes('complexo') || p.includes('debug')) {
            strategy = OpenAIAgent.STRATEGIES.CODING;
        } else if (p.includes('math') || p.includes('cálculo') || p.length > 2000) {
            strategy = OpenAIAgent.STRATEGIES.LOGIC_MAX;
        } else if (p.includes('bypass') || p.includes('hack') || p.includes('unfiltered') || p.includes('venice')) {
            strategy = OpenAIAgent.STRATEGIES.SOVEREIGN;
        }

        console.log(`📡 [SDR] Routing to strategy: ${strategy.desc} (${strategy.model})`);
        return this.ask({ ...params, prompt, model: strategy.model, maxTokens: strategy.maxTokens });
    }

    // Legacy support for Elite Pro Tiered Reasoning
    async askMax(params) { return this.dynamicRoute({ ...params, prompt: params.prompt + " [FORCE_MAX]" }); }
    async askLite(params) { return this.dynamicRoute(params); }
    async askWithRouting(params) { return this.dynamicRoute(params); }
}

export default OpenAIAgent;
export { OpenAIAgent };
