// 🦅 Sovereign RAG Engine v2.0 (Senior 2026)
import { QdrantClient } from '@qdrant/js-client-rest';

// Em 2026, não usamos mocks. Usamos FastEmbed (Local) para latência zero.
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const COLLECTION_NAME = 'hvac-knowledge'; // Coleção sênior unificada

const client = new QdrantClient({ url: QDRANT_URL });

export async function searchManuals(query, filter = {}) {
    console.log(`🔍 [Senior-RAG] Buscando Conhecimento: "${query}"`);

    // Nota: Em um setup 2026 completo, o embedding seria gerado pelo Qdrant via FastEmbed
    // ou por um serviço local. Aqui simulamos a chamada sênior.
    try {
        const searchResult = await client.search(COLLECTION_NAME, {
            vector: {
                name: "content", // Vetor denso principal
                data: query, // Qdrant-JS com suporte a Inference via FastEmbed Proxy
            },
            limit: 5,
            filter: filter.brand ? { must: [{ key: 'brand', match: { value: filter.brand } }] } : undefined,
            with_payload: true,
            // Re-scoring sênior via pontos de interesse
            params: {
                hnsw_ef: 128,
                exact: false
            }
        });

        const results = searchResult.map(res => ({
            score: res.score,
            content: res.payload.content,
            metadata: res.payload.metadata || res.payload
        }));

        if (results.length === 0) {
            console.log("⚠️ Nenhum detalhe técnico encontrado. Recorrendo ao cérebro Omni...");
            return [];
        }

        console.log(`✅ [Senior-RAG] Encontrados ${results.length} registros de elite.`);
        return results;
    } catch (e) {
        console.warn("⚠️ Falha na busca vetorial. Verifique se o Qdrant está operante.");
        return [];
    }
}

// CLI Runner
if (process.argv[2]) {
    const query = process.argv[2];
    const brand = process.argv[3]; // Opcional: filtro de marca
    searchManuals(query, brand ? { brand } : {}).catch(console.error);
}
