import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const client = new QdrantClient({ url: QDRANT_URL });

const DOMAINS = [
    'domain-hvac',
    'domain-code',
    'domain-openclaw',
    'domain-will'
];

async function initDomains() {
    console.log("🚀 Inicializando Domínios Segregados no Qdrant...");

    try {
        const collectionsResponse = await client.getCollections();
        const existingCollections = collectionsResponse.collections.map(c => c.name);

        for (const domain of DOMAINS) {
            if (existingCollections.includes(domain)) {
                console.log(`✅ Domínio '${domain}' já existe.`);
            } else {
                console.log(`🆕 Criando domínio '${domain}'...`);
                await client.createCollection(domain, {
                    vectors: {
                        size: 384, // Ajustar conforme o modelo de embedding (FastEmbed all-MiniLM-L6-v2 usa 384)
                        distance: 'Cosine'
                    },
                    optimizers_config: {
                        default_segment_number: 2
                    },
                    replication_factor: 2
                });
                console.log(`✅ Domínio '${domain}' criado com sucesso.`);
            }
        }

        console.log("\n🎯 Todos os domínios estão prontos e segregados.");
    } catch (error) {
        console.error("❌ Erro ao inicializar domínios:", error.message);
        if (error.message.includes('ECONNREFUSED')) {
            console.error("   DICA: Verifique se o container Qdrant está rodando (docker ps).");
        }
    }
}

initDomains();
