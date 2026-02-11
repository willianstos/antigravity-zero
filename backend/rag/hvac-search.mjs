import { QdrantClient } from '@qdrant/js-client-rest';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai'; // Em produção usaríamos embeddings reais
// Mock de embeddings para teste local sem custo
class MockEmbeddings {
    async embedQuery(text) {
        return new Array(384).fill(0).map(() => Math.random());
    }
}

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const COLLECTION_NAME = 'hvac-manuals';

// Qdrant Client
const client = new QdrantClient({ url: QDRANT_URL });
const embeddings = new MockEmbeddings();

export async function searchManuals(query, filter = {}) {
    console.log(`🔍 Buscando: "${query}"`);

    // 1. Gerar embedding da query
    const vector = await embeddings.embedQuery(query);

    // 2. Construir filtro do Qdrant (payload match)
    const qdrantFilter = {};
    if (filter.brand) qdrantFilter.must = [{ key: 'brand', match: { value: filter.brand } }];
    if (filter.model) qdrantFilter.must = [...(qdrantFilter.must || []), { key: 'model', match: { value: filter.model } }];

    // 3. Busca vetorial
    const searchResult = await client.search(COLLECTION_NAME, {
        vector,
        limit: 5,
        filter: Object.keys(qdrantFilter).length > 0 ? qdrantFilter : undefined,
        with_payload: true,
    });

    // 4. Formatar resultados
    const results = searchResult.map(res => ({
        score: res.score,
        content: res.payload.content,
        metadata: {
            source: res.payload.source,
            brand: res.payload.brand,
            model: res.payload.model,
            page: res.payload.page
        }
    }));

    if (results.length === 0) {
        console.log("⚠️ Nenhum resultado relevante encontrado.");
        return [];
    }

    console.log(`✅ Encontrados ${results.length} trechos relevantes.`);
    results.forEach((r, i) => {
        console.log(`\n[${i + 1}] (Score: ${r.score.toFixed(4)}) Source: ${r.metadata.source} (p.${r.metadata.page})`);
        console.log(`    "${r.content.substring(0, 100)}..."`);
    });

    return results;
}

// CLI Runner
if (process.argv[2]) {
    const query = process.argv[2];
    const brand = process.argv[3]; // Opcional: filtro de marca
    searchManuals(query, brand ? { brand } : {}).catch(console.error);
}
