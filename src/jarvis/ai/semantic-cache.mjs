#!/usr/bin/env node
// ================================================
// 🗃️ SEMANTIC CACHE — Redis Response Cache (2026)
// Evita chamadas repetidas à API para perguntas
// semanticamente similares.
// Economia estimada: 30-40% nas repetições.
// ================================================

import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const CACHE_PREFIX = 'scache:';
const DEFAULT_TTL = 3600; // 1 hora

// Similaridade simples por hash de palavras-chave normalizadas
function normalizeKey(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')       // remove pontuação
        .replace(/\s+/g, ' ')          // normaliza espaços
        .trim()
        .split(' ')
        .filter(w => w.length > 3)     // remove stopwords curtas
        .sort()                         // ordena para invariância de ordem
        .slice(0, 12)                   // pega as 12 palavras mais longas
        .join('|');
}

class SemanticCache {
    constructor() {
        this.client = null;
        this.ready = false;
        this.hits = 0;
        this.misses = 0;
    }

    async connect() {
        try {
            this.client = createClient({ url: REDIS_URL });
            this.client.on('error', (err) => {
                // Cache é opcional — não quebra o sistema se Redis cair
                if (process.env.DEBUG_CACHE) console.warn('⚠️ [Cache] Redis error:', err.message);
            });
            await this.client.connect();
            this.ready = true;
            console.log('🗃️ [Cache] Semantic cache conectado ao Redis');
        } catch (err) {
            console.warn('⚠️ [Cache] Redis indisponível — operando sem cache:', err.message);
            this.ready = false;
        }
    }

    /**
     * Busca uma resposta cacheada para a mensagem
     * @param {string} message
     * @returns {string|null} resposta cacheada ou null
     */
    async get(message) {
        if (!this.ready || !this.client) return null;
        try {
            const key = CACHE_PREFIX + normalizeKey(message);
            const cached = await this.client.get(key);
            if (cached) {
                this.hits++;
                const data = JSON.parse(cached);
                console.log(`🗃️ [Cache] HIT (${this.hits} total) — economia: ~${data.tokens || '?'} tokens`);
                return data.response;
            }
            this.misses++;
            return null;
        } catch {
            return null;
        }
    }

    /**
     * Armazena uma resposta no cache
     * @param {string} message
     * @param {string} response
     * @param {object} meta - { tokens, tier, model }
     * @param {number} ttl - TTL em segundos (padrão: 1h)
     */
    async set(message, response, meta = {}, ttl = DEFAULT_TTL) {
        if (!this.ready || !this.client) return;
        // Não cacheia respostas de ações executadas (SUDO/EXECUTE)
        if (message.toUpperCase().startsWith('SUDO:') ||
            message.toUpperCase().startsWith('EXECUTE:') ||
            message.toUpperCase().startsWith('MISSÃO:')) return;

        try {
            const key = CACHE_PREFIX + normalizeKey(message);
            await this.client.setEx(key, ttl, JSON.stringify({
                response,
                tokens: meta.tokens,
                tier: meta.tier,
                model: meta.model,
                cachedAt: new Date().toISOString(),
            }));
        } catch { /* silencioso */ }
    }

    /**
     * Invalida cache de uma mensagem específica
     */
    async invalidate(message) {
        if (!this.ready || !this.client) return;
        try {
            const key = CACHE_PREFIX + normalizeKey(message);
            await this.client.del(key);
        } catch { /* silencioso */ }
    }

    /**
     * Retorna estatísticas do cache
     */
    stats() {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(1) : '0.0';
        return { hits: this.hits, misses: this.misses, hitRate: `${hitRate}%`, ready: this.ready };
    }
}

// Singleton
const semanticCache = new SemanticCache();
export default semanticCache;
