import 'dotenv/config';
import { createClient } from 'redis';
import fs from 'fs';
import path from 'path';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const ENV_PATH = path.resolve('.env');
const VAULT_PREFIX = 'vault:';
const TTL_SECONDS = 86400; // 24 horas

async function getClient() {
    const client = createClient({ url: REDIS_URL });
    client.on('error', err => console.error('❌ [Vault] Redis error:', err.message));
    await client.connect();
    return client;
}

// Carregar secrets do .env para Redis
async function loadSecrets() {
    console.log('🔐 [Vault] Carregando secrets do .env para Redis...');
    const client = await getClient();

    const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
    const lines = envContent.split('\n').filter(l => l.trim() && !l.startsWith('#'));

    let loaded = 0;
    for (const line of lines) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
            const cleanKey = key.trim();
            const cleanValue = value.replace(/^["']|["']$/g, '');
            await client.setEx(`${VAULT_PREFIX}${cleanKey}`, TTL_SECONDS, cleanValue);
            console.log(`  ✅ ${cleanKey} → Redis (TTL: ${TTL_SECONDS}s)`);
            loaded++;
        }
    }

    console.log(`\n🔐 [Vault] ${loaded} secrets carregadas. TTL: 24h. Honra garantida! 🛡️`);
    await client.quit();
}

// Consultar secret via Redis (NUNCA logar o valor completo)
async function getSecret(key) {
    const client = await getClient();
    const value = await client.get(`${VAULT_PREFIX}${key}`);

    if (value) {
        const masked = value.substring(0, 4) + '***' + value.substring(value.length - 4);
        console.log(`🔐 [Vault] ${key}: ${masked} (mascarado por segurança)`);
    } else {
        console.log(`❌ [Vault] ${key}: NÃO ENCONTRADA no vault`);
    }

    await client.quit();
    return value;
}

// Listar todas as secrets no vault (apenas nomes, nunca valores)
async function listSecrets() {
    const client = await getClient();
    const keys = await client.keys(`${VAULT_PREFIX}*`);

    console.log('🔐 [Vault] Secrets armazenadas:');
    for (const key of keys) {
        const ttl = await client.ttl(key);
        const name = key.replace(VAULT_PREFIX, '');
        const hours = Math.floor(ttl / 3600);
        const mins = Math.floor((ttl % 3600) / 60);
        console.log(`  🔑 ${name} (expira em ${hours}h${mins}m)`);
    }

    console.log(`\n  Total: ${keys.length} secrets protegidas`);
    await client.quit();
}

// Revogar secret (remover do vault)
async function revokeSecret(key) {
    const client = await getClient();
    await client.del(`${VAULT_PREFIX}${key}`);
    console.log(`🚨 [Vault] ${key} REVOGADA do vault. Rotação necessária!`);
    await client.quit();
}

// Health check do vault
async function healthCheck() {
    try {
        const client = await getClient();
        const keys = await client.keys(`${VAULT_PREFIX}*`);
        const info = await client.info('memory');
        const memoryMatch = info.match(/used_memory_human:(.+)/);
        const memory = memoryMatch ? memoryMatch[1].trim() : 'N/A';

        console.log('🔐 [Vault] Health Check:');
        console.log(`  ✅ Redis: Conectado`);
        console.log(`  🔑 Secrets: ${keys.length}`);
        console.log(`  💾 Memória: ${memory}`);
        console.log(`  🛡️ Status: OPERACIONAL`);

        await client.quit();
    } catch (error) {
        console.error(`❌ [Vault] Health Check FALHOU: ${error.message}`);
        console.error('  💡 Dica: sudo systemctl start redis-server');
    }
}

// CLI
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
    case 'load':
        await loadSecrets();
        break;
    case 'get':
        if (!arg) { console.error('Uso: node redis-vault.mjs get <KEY>'); process.exit(1); }
        await getSecret(arg);
        break;
    case 'list':
        await listSecrets();
        break;
    case 'revoke':
        if (!arg) { console.error('Uso: node redis-vault.mjs revoke <KEY>'); process.exit(1); }
        await revokeSecret(arg);
        break;
    case 'health':
        await healthCheck();
        break;
    default:
        console.log(`
🔐 Redis Vault — Guardião de Secrets v1.0

Comandos:
  load              Carregar secrets do .env para Redis
  get <KEY>         Consultar secret (valor mascarado)
  list              Listar todas as secrets (só nomes)
  revoke <KEY>      Revogar secret do vault
  health            Health check do vault
        `);
}
