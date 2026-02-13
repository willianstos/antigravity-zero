#!/usr/bin/env node
// ================================================
// ⚙️ CONFIG — Environment configuration loader
// ================================================

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

// Load .env file manually (no dep needed for simple cases)
function loadEnv() {
    const envPath = join(ROOT, '.env');
    if (!existsSync(envPath)) return {};

    const content = readFileSync(envPath, 'utf8');
    const vars = {};

    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let value = trimmed.slice(eqIdx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        vars[key] = value;
        if (!process.env[key]) process.env[key] = value;
    }
    return vars;
}

const env = loadEnv();

export const config = {
    root: ROOT,
    telegramToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramAdminId: process.env.TELEGRAM_ADMIN_ID || '',
    openaiKey: process.env.OPENAI_API_KEY || '',
    geminiKey: process.env.GEMINI_API_KEY || '',
    qdrantHost: process.env.QDRANT_HOST || 'localhost',
    qdrantPort: parseInt(process.env.QDRANT_PORT || '6333'),
    jarvisPort: parseInt(process.env.JARVIS_PORT || '7777'),
    localstackEndpoint: process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566',
    minioEndpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9005',
    minioUser: process.env.MINIO_ROOT_USER || 'sovereign',
    minioPass: process.env.MINIO_ROOT_PASSWORD || 'sovereign2026',
};

export default config;
