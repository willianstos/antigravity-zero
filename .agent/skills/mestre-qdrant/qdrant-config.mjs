/**
 * Configuração de Conexão com o Qdrant (Cluster Antigravity)
 * Aponta para o H1 (Master) para persistência centralizada.
 */

export const qdrantConfig = {
  url: process.env.QDRANT_HOST ? `http://${process.env.QDRANT_HOST}:${process.env.QDRANT_PORT || 6333}` : 'http://192.168.1.15:6333',
  apiKey: process.env.QDRANT_API_KEY || null,
  collections: {
    hvac: "domain-hvac",
    code: "domain-code",
    system: "domain-openclaw",
    personal: "domain-will"
  }
};

console.log(`📡 Qdrant Config: Conectando em ${qdrantConfig.url}`);
