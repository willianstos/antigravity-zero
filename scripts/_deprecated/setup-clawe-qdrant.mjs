import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({ host: 'localhost', port: 6333 });

async function setup() {
    console.log("🚀 Configurando coleções Qdrant p/ Sovereign Swarm...");
    try {
        await client.createCollection('hvac_knowledge', {
            vectors: { size: 1536, distance: 'Cosine' }
        });
        console.log("✅ Coleção hvac_knowledge criada!");
    } catch (e) {
        console.log("⚠️ " + e.message);
    }
}
setup();
