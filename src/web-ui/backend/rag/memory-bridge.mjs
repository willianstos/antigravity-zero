import { QdrantClient } from '@qdrant/js-client-rest';
// De novo, Mock Embeddings para teste local (em prod usar OpenAI/HuggingFace)
class MockEmbeddings {
    async embedQuery(text) {
        return new Array(384).fill(0).map(() => Math.random());
    }
}

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const COLLECTION_NAME = 'hvac-facts'; // Nova collection L3 de fatos aprendidos

// Qdrant Client
const client = new QdrantClient({ url: QDRANT_URL });
const embeddings = new MockEmbeddings();

// Inicializar Collection (Idempotente)
export async function initMemory() {
    try {
        const collections = await client.getCollections();
        const exists = collections.collections.some(c => c.name === COLLECTION_NAME);
        if (!exists) {
            console.log(`🧠 Criando memória L3 (${COLLECTION_NAME})...`);
            await client.createCollection(COLLECTION_NAME, {
                vectors: { size: 384, distance: 'Cosine' }
            });
            console.log("✅ Memória L3 inicializada!");
        }
    } catch (e) {
        console.warn("⚠️  Aviso ao acessar Qdrant (pode estar offline):", e.message);
    }
}

// Lembrar um fato (Write to L3)
export async function rememberFact(fact, context = "user-input") {
    console.log(`🧠 Aprendendo novo fato: "${fact}"`);

    const vector = await embeddings.embedQuery(fact);

    await client.upsert(COLLECTION_NAME, {
        points: [{
            id: crypto.randomUUID(),
            vector: vector,
            payload: {
                content: fact,
                context: context,
                timestamp: new Date().toISOString(),
                verified: true // Assumindo input humano como verificado
            }
        }]
    });

    console.log("✅ Fato memorizado na L3.");
    return { status: 'success', fact };
}

// Relembrar fatos (Read from L3)
export async function recallFacts(query, limit = 3) {
    console.log(`🤔 Tentando lembrar sobre: "${query}"`);

    const vector = await embeddings.embedQuery(query);

    const searchResult = await client.search(COLLECTION_NAME, {
        vector,
        limit,
        with_payload: true,
        score_threshold: 0.75 // Só lembrar se tiver certeza
    });

    const facts = searchResult.map(res => ({
        fact: res.payload.content,
        context: res.payload.context,
        score: res.score
    }));

    if (facts.length > 0) {
        console.log(`💡 Lembrei de ${facts.length} fatos relevantes!`);
        facts.forEach(f => console.log(`   - "${f.fact}" (Score: ${f.score.toFixed(2)})`));
    } else {
        console.log("🤷‍♂️ Não me lembro de nada específico sobre isso na L3.");
    }

    return facts;
}

// CLI Runner
if (process.argv[2] === 'init') initMemory();
if (process.argv[2] === 'remember') rememberFact(process.argv[3], process.argv[4]);
if (process.argv[2] === 'recall') recallFacts(process.argv[3]);
