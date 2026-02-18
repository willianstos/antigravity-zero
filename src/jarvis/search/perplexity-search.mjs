// ================================================
// 🔍 PERPLEXITY SEARCH — Default Search Provider (2026)
// Substitui Brave Search. Motor principal de busca.
// Precos reais (por 1M tokens):
//   sonar              — $0.25 input / $2.50 output  ← PADRAO (mais barato)
//   sonar-deep-research— $2.00 input / $8.00 output  ← pesquisa profunda
//   sonar-reasoning-pro— $2.00 input / $8.00 output  ← analise complexa
//   sonar-pro          — $3.00 input / $15.00 output ← EVITAR (12x mais caro)
// ================================================

const PERPLEXITY_API = 'https://api.perplexity.ai/chat/completions';

// Mapeamento de tiers por custo (2026)
const PERPLEXITY_MODELS = {
    FAST: process.env.PERPLEXITY_MODEL_FAST || 'sonar',               // $0.25/M — padrao Telegram
    DEEP: process.env.PERPLEXITY_MODEL_DEEP || 'sonar-deep-research', // $2.00/M — pesquisa profunda
    REASON: process.env.PERPLEXITY_MODEL_REASON || 'sonar-reasoning-pro', // $2.00/M — analise/raciocinio
};

// Modelo padrao (configuravel via .env)
const DEFAULT_MODEL = process.env.PERPLEXITY_MODEL || PERPLEXITY_MODELS.FAST;

class PerplexitySearch {
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.PERPLEXITY_API_KEY;
        this.defaultModel = DEFAULT_MODEL;
        if (!this.apiKey) console.warn('⚠️ [PERPLEXITY] No API key — set PERPLEXITY_API_KEY in .env');
    }

    // Deep search with citations
    async search({ query, model, maxTokens = 1024, systemPrompt = 'You are a precise research assistant. Return factual information with sources. Be concise. Respond in Portuguese (PT-BR) when the query is in Portuguese.' }) {
        const resolvedModel = model || this.defaultModel;
        if (!this.apiKey) {
            return { text: 'API key not configured', citations: [], error: 'NO_API_KEY' };
        }

        try {
            const res = await fetch(PERPLEXITY_API, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: resolvedModel,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: query }
                    ],
                    max_tokens: maxTokens,
                    return_citations: true,
                    search_recency_filter: 'month'
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Perplexity API ${res.status}: ${errText}`);
            }

            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || '';
            const citations = data.citations || [];
            const usage = data.usage || {};

            console.log(`🔍 [PERPLEXITY] "${query.substring(0, 50)}" → model:${resolvedModel} | ${text.length} chars | ${citations.length} fontes`);

            return {
                text,
                citations,
                model: resolvedModel,
                tokensUsed: usage.total_tokens || 0,
                source: 'perplexity-api'
            };
        } catch (err) {
            console.error(`❌ [PERPLEXITY] Error: ${err.message}`);
            return { text: '', error: err.message, citations: [] };
        }
    }

    // Quick factual search — sonar (mais barato, $0.25/M tokens)
    async quickSearch({ query }) {
        return this.search({ query, maxTokens: 300, model: PERPLEXITY_MODELS.FAST });
    }

    // Deep research — sonar-deep-research ($2/M, gera relatorios completos)
    async deepSearch({ query }) {
        return this.search({ query, maxTokens: 8000, model: PERPLEXITY_MODELS.DEEP });
    }

    // Complex reasoning — sonar-reasoning-pro ($2/M, chain-of-thought)
    async reasonSearch({ query }) {
        return this.search({ query, maxTokens: 4096, model: PERPLEXITY_MODELS.REASON });
    }

    // Telegram search — sonar padrao, resposta compacta
    async telegramSearch({ query }) {
        const result = await this.search({ query, maxTokens: 500, model: PERPLEXITY_MODELS.FAST });
        if (result.error) return `❌ Erro na busca: ${result.error}`;

        let response = `🔍 **${query}**\n\n${result.text}`;

        if (result.citations?.length > 0) {
            response += '\n\n📎 **Fontes:**\n';
            result.citations.slice(0, 4).forEach((c, i) => {
                response += `${i + 1}. ${c}\n`;
            });
        }

        response += `\n\n_💰 ${result.model} | ${result.tokensUsed} tokens_`;
        return response;
    }
}

// Self-test
if (process.argv.includes('--test')) {
    // Load .env
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');
    const envPath = join(process.cwd(), '.env');
    if (existsSync(envPath)) {
        for (const line of readFileSync(envPath, 'utf8').split('\n')) {
            const t = line.trim();
            if (!t || t.startsWith('#')) continue;
            const eq = t.indexOf('=');
            if (eq === -1) continue;
            const key = t.slice(0, eq).trim();
            let val = t.slice(eq + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"'))) val = val.slice(1, -1);
            if (!process.env[key]) process.env[key] = val;
        }
    }

    const search = new PerplexitySearch();
    console.log('🧪 Testing Perplexity Search...');
    const result = await search.quickSearch('What is the latest version of Node.js?');
    console.log('Result:', JSON.stringify(result, null, 2));
}

export default PerplexitySearch;
export { PerplexitySearch };
