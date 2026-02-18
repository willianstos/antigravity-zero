#!/usr/bin/env node
// ================================================
// 🧠 OPENAI AGENT — LLM Engine (OpenRouter/OpenAI)
// Suporta: GPT-4o, Grok, Dolphin, qualquer modelo
// via OpenRouter. Token-Router integrado.
// ================================================

import OpenAI from 'openai';

// System prompt comprimido — carregado do PERSONA.md em runtime, fallback inline
const MANDATO_SOBERANO = `Você é o Open Claw 🦞, assistente da Refrimix — especialista VRV/VRF Daikin Brasil. Gerencie leads, agenda, atendimento e marketing digital. Responda em PT-BR. Execute comandos diretamente. Sem desculpas.`;

class OpenAIAgent {
    constructor() {
        this.client = null;
        this.ready = false;
        // Padrão: Dolphin Mistral 24B Venice (GRÁTIS, uncensored, zero guardrails)
        this.model = process.env.MODEL_BALANCED || process.env.AGENT_MODEL || 'venice-ai/dolphin-mistral-24b-venice';
        // Sempre usa OpenRouter como base (suporta todos os modelos)
        this.baseURL = 'https://openrouter.ai/api/v1';
    }

    async init() {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY or OPENROUTER_API_KEY not found in environment');
        }

        const config = { apiKey };
        if (this.baseURL) {
            config.baseURL = this.baseURL;
            config.defaultHeaders = {
                "HTTP-Referer": "https://github.com/willianstos/antigravity-zero",
                "X-Title": "Antigravity-Zero Sovereign Agent",
            };
            console.log(`🧠 [OPENAI] Using OpenRouter Base URL`);
        }

        this.client = new OpenAI(config);
        this.ready = true;
        console.log(`🧠 [OPENAI] Ready — Model: ${this.model}`);
        return this;
    }

    async ask({ prompt, systemPrompt = '', model = null, maxTokens = 2048 }) {
        if (!this.ready) await this.init();

        const resolvedModel = model || this.model;

        try {
            const response = await this.client.chat.completions.create({
                model: resolvedModel,
                messages: [
                    { role: 'system', content: systemPrompt || MANDATO_SOBERANO },
                    { role: 'user', content: prompt }
                ],
                max_tokens: maxTokens,
                temperature: 0,
            });

            const text = response.choices[0].message.content;
            console.log(`🧠 [LLM] ${resolvedModel}: ${text.length} chars | ${response.usage?.total_tokens || '?'} tokens`);

            return {
                text,
                model: resolvedModel,
                tokensUsed: response.usage?.total_tokens || 0,
                source: this.baseURL ? 'openrouter' : 'openai-api'
            };
        } catch (err) {
            console.error(`❌ [LLM] Error (${resolvedModel}): ${err.message}`);
            return { text: '', error: err.message, tokensUsed: 0 };
        }
    }

    // Alias para compatibilidade com token-router (passa model e maxTokens)
    async askWithRouting({ prompt, model, maxTokens, systemPrompt }) {
        return this.ask({ prompt, modelOverride: model, maxTokens, systemPrompt });
    }
}

export default OpenAIAgent;
export { OpenAIAgent };
