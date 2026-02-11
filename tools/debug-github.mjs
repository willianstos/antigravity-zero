/**
 * 🕵️ GitHub MCP Debug Tool
 * Valida conectividade, token e permissões básicas.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');

function getEnvVar(key) {
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(new RegExp(`^${key}=["']?([^"'\n]+)["']?`, 'm'));
    return match ? match[1] : null;
}

const token = getEnvVar('GITHUB_TOKEN');

if (!token) {
    console.error("❌ GITHUB_TOKEN não encontrado no .env");
    process.exit(1);
}

console.log(`🔍 Validando token (Prefix: ${token.substring(0, 4)}***)...`);

const options = {
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
        'User-Agent': 'Antigravity-Debug-Tool',
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
    }
};

const req = https.request(options, (res) => {
    console.log(`📡 Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => data += chunk);

    res.on('end', () => {
        if (res.statusCode === 200) {
            const user = JSON.parse(data);
            console.log(`✅ Autenticado como: ${user.login}`);
            console.log(`✅ Permissões de Scopes: ${res.headers['x-oauth-scopes'] || 'N/A'}`);
            process.exit(0);
        } else {
            console.error(`❌ Falha na autenticação: ${data}`);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Erro de conexão: ${e.message}`);
    process.exit(1);
});

req.end();
