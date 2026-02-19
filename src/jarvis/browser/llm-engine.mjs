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

    async ask({ prompt, systemPrompt = '', model = null, maxTokens = 4096 }) {
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
            console.log(`🧠 [LLM] ${resolvedModel}: ${text.length} chars`);
            return { text, model: resolvedModel };
        } catch (err) {
            console.error(`❌ [LLM] Error: ${err.message}`);
            return { text: '', error: err.message };
        }
    }

    // Manus/Meta Style: Tiered Reasoning
    async askMax(params) {
        // Grok-2 or Llama-3.1-405B for deep architecture/coding
        const model = process.env.MODEL_POWER || 'meta-llama/llama-3.1-405b-instruct';
        console.log(`🧠 [LLM-MAX] Using ${model} for deep reasoning...`);
        return this.ask({ ...params, model, maxTokens: 8192 });
    }

    async askLite(params) {
        // Fast Dolphin/24B for quick checks
        const model = process.env.MODEL_FAST || 'venice-ai/dolphin-mistral-24b-venice';
        console.log(`🧠 [LLM-LITE] Using ${model} for quick response...`);
        return this.ask({ ...params, model, maxTokens: 2048 });
    }

    async askWithRouting(params) {
        const isComplex = params.prompt.length > 1000 || params.prompt.match(/arquitetura|refactor|debug|complexo|fix|projeto/i);
        return isComplex ? this.askMax(params) : this.askLite(params);
    }
}

export default OpenAIAgent;
export { OpenAIAgent };
