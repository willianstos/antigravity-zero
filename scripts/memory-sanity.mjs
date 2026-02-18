// 🧠 JARVIS MEMORY SANITY — Qdrant Maintenance
// //mode: cleanup //sudo=1

import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({ host: 'localhost', port: 6333 });
const COLLECTION = 'jarvis_memory';

async function sanityCheck() {
    console.log(`🧠 [MEMORY] Starting sanity check for collection: ${COLLECTION}`);

    try {
        const collections = await client.getCollections();
        const exists = collections.collections.some(c => c.name === COLLECTION);

        if (!exists) {
            console.log(`❌ [MEMORY] Collection ${COLLECTION} does not exist. Creating...`);
            await client.createCollection(COLLECTION, {
                vectors: { size: 1536, distance: 'Cosine' }
            });
            console.log(`✅ [MEMORY] Collection created.`);
        } else {
            console.log(`✅ [MEMORY] Collection health: OK`);
            const status = await client.getCollection(COLLECTION);
            console.log(`📊 [MEMORY] Points count: ${status.points_count}`);
        }

    } catch (err) {
        console.error(`❌ [MEMORY] Sanity check failed: ${err.message}`);
    }
}

sanityCheck();
