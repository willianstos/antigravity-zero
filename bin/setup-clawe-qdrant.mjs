import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({ host: 'localhost', port: 6333 });

async function setup() {
    console.log("🚀 Iniciando Setup de Coleções Clawe...");

    const collections = ['swarm_toolbox', 'open_claw_skills'];

    for (const name of collections) {
        try {
            const result = await client.getCollections();
            const exists = result.collections.find(c => c.name === name);

            if (!exists) {
                console.log(`Creating collection: ${name}`);
                await client.createCollection(name, {
                    vectors: { size: 1536, distance: 'Cosine' } // Padrão OpenAI embeddings
                });
                console.log(`✅ Collection ${name} created.`);
            } else {
                console.log(`ℹ️ Collection ${name} already exists.`);
            }
        } catch (error) {
            console.error(`❌ Error setting up ${name}:`, error.message);
        }
    }
}

setup();
