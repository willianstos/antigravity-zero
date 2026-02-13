// ================================================
// 🧹 CONTEXT MANAGER — Infinite Awareness
// Monitors context weight, condenses it, and
// ensures long-term semantic persistence in Qdrant.
// ================================================

import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vectorStore from './vector-store.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..');
const CONTEXT_FILE = join(ROOT, 'data', 'session_context.log');
const CONTEXT_THRESHOLD = 12000; // ~12KB or ~3000 tokens

class ContextManager {
    constructor() {
        this.currentContext = '';
        this._load();
    }

    _load() {
        if (existsSync(CONTEXT_FILE)) {
            this.currentContext = readFileSync(CONTEXT_FILE, 'utf8');
        }
    }

    // Add interaction to context
    async addInteraction(role, text) {
        const entry = `[${new Date().toISOString()}] ${role.toUpperCase()}: ${text}\n`;
        appendFileSync(CONTEXT_FILE, entry);
        this.currentContext += entry;

        // Check if we need to condense
        if (this.currentContext.length > CONTEXT_THRESHOLD) {
            await this.condense();
        }
    }

    // Condense context: Summarize and store in Qdrant
    async condense() {
        console.log('🧹 [CONTEXT] Context is heavy. Condensing...');

        try {
            // 1. Get Summary from AI (using Gemini Web or OpenAI)
            // For now, we'll store the whole block as a "context-chunk"
            // and maybe a simple summary if we use an AI agent.

            const chunk = this.currentContext;

            // 2. Semantic storage
            await vectorStore.store(chunk, { type: 'context-chunk', date: new Date().toISOString() });

            // 3. Keep only the last 2KB for immediate "Short term memory"
            const shortTerm = chunk.slice(-2000);
            const summary = `--- CONTEXT CONDENSED AT ${new Date().toISOString()} ---\n` +
                `Semantics moved to Qdrant. Highlights preserved.\n` +
                `ST-Memory: ...${shortTerm}\n`;

            this.currentContext = summary;
            writeFileSync(CONTEXT_FILE, summary);

            console.log('✅ [CONTEXT] Condensation complete. Awareness persisted.');
            return true;
        } catch (err) {
            console.error(`❌ [CONTEXT] Condensation failed: ${err.message}`);
            return false;
        }
    }

    // Get relevant past context for a query
    async getRelevantContext(query) {
        const hits = await vectorStore.search(query, 3);
        if (hits.length === 0) return '';

        return hits.map(hit => `[Past Memory - ${hit.payload.timestamp}]\n${hit.payload.text}`).join('\n\n');
    }

    // Highjack: Get full current context + relevant semantic memories
    async getFullContext(query = '') {
        const semantic = query ? await this.getRelevantContext(query) : '';
        return `SHORT-TERM CONTEXT:\n${this.currentContext}\n\nRELEVANT LONG-TERM MEMORY:\n${semantic}`;
    }
}

export default new ContextManager();
export { ContextManager };
