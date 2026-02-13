#!/usr/bin/env node
// ================================================
// 🔍 PERPLEXITY SEARCH — Deep Research API
// Replaces Brave Search with Perplexity API
// Faster, smarter, with citations
// ================================================

const PERPLEXITY_API = 'https://api.perplexity.ai/chat/completions';

class PerplexitySearch {
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.PERPLEXITY_API_KEY;
        if (!this.apiKey) console.warn('⚠️ [PERPLEXITY] No API key — set PERPLEXITY_API_KEY in .env');
    }

    // Deep search with citations
    async search({ query, model = 'sonar', maxTokens = 1024, systemPrompt = 'You are a precise research assistant. Return factual information with sources. Be concise. Respond in Portuguese (PT-BR) when the query is in Portuguese.' }) {
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
                    model,
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

            console.log(`🔍 [PERPLEXITY] "${query.substring(0, 50)}..." → ${text.length} chars, ${citations.length} citations`);

            return {
                text,
                citations,
                model: data.model,
                tokensUsed: usage.total_tokens || 0,
                source: 'perplexity-api'
            };
        } catch (err) {
            console.error(`❌ [PERPLEXITY] Error: ${err.message}`);
            return { text: '', error: err.message, citations: [] };
        }
    }

    // Quick factual search (shorter response)
    async quickSearch({ query }) {
        return this.search({ query, maxTokens: 256, model: 'sonar' });
    }

    // Deep research (longer, more detailed)
    async deepSearch({ query }) {
        return this.search({ query, maxTokens: 4096, model: 'sonar-pro' });
    }

    // Search and summarize for Telegram (compact format)
    async telegramSearch({ query }) {
        const result = await this.search({ query, maxTokens: 512 });
        if (result.error) return `❌ Erro: ${result.error}`;

        let response = `🔍 **${query}**\n\n${result.text}`;

        if (result.citations.length > 0) {
            response += '\n\n📎 **Fontes:**\n';
            result.citations.slice(0, 5).forEach((c, i) => {
                response += `${i + 1}. ${c}\n`;
            });
        }

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
