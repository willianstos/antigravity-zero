#!/usr/bin/env node
// ================================================
// 🐝 SWARM API SERVER — Agent Communication Hub
// REST API for dashboard + agent-to-agent messaging
// Serves the Notion-like dashboard
// ================================================

import http from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { JarvisOrchestrator } from './orchestrator.mjs';
import { apiLimiter, executeLimiter } from './security/rate-limiter.mjs';

// Load .env
import dotenv from 'dotenv';
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '..', '.env') });

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.JARVIS_PORT || 7777;
const DASHBOARD_DIR = join(__dirname, '..', '..', 'dashboard');

// In-memory agent message bus
const messageBus = [];
const MAX_MESSAGES = 500;

function addMessage(from, to, type, data) {
    const msg = { id: Date.now(), from, to, type, data, timestamp: new Date().toISOString() };
    messageBus.push(msg);
    if (messageBus.length > MAX_MESSAGES) messageBus.shift();
    return msg;
}

// MIME types
const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

// Boot
const jarvis = new JarvisOrchestrator();

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const path = url.pathname;

    // CORS — Restrito a localhost (CVE-2026-25253 mitigation)
    const origin = req.headers.origin || '';
    const allowedOrigin = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') ? origin : 'http://localhost';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    // Rate limiting
    const limiter = path.startsWith('/api/execute') || path.startsWith('/api/swarm') ? executeLimiter : apiLimiter;
    const rlCheck = limiter.middleware()(req, res, null);
    if (rlCheck !== true && !path.startsWith('/api/status') && path.startsWith('/api/')) return;

    // Bearer Token Auth para rotas de execução (T02 - CVE-2026-25253)
    const JARVIS_TOKEN = process.env.JARVIS_API_TOKEN;
    if (JARVIS_TOKEN && (path.startsWith('/api/execute') || path.startsWith('/api/swarm'))) {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace('Bearer ', '').trim();
        if (token !== JARVIS_TOKEN) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized: Invalid or missing API token' }));
            return;
        }
    }

    // --- API Routes ---
    if (path === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jarvis.getStatus()));
        return;
    }

    if (path === '/api/heartbeat') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'alive',
            timestamp: new Date().toISOString(),
            version: '1.0.0-opus',
            sovereign: true
        }));
        return;
    }

    if (path === '/api/messages') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', c => body += c);
            req.on('end', () => {
                try {
                    const { from, to, type, data } = JSON.parse(body);
                    const msg = addMessage(from, to, type || 'task', data);
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(msg));
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: e.message }));
                }
            });
            return;
        }
        // GET messages
        const since = parseInt(url.searchParams.get('since') || '0');
        const filtered = messageBus.filter(m => m.id > since);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(filtered));
        return;
    }

    if (path === '/api/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', async () => {
            try {
                const { agent, action, params } = JSON.parse(body);
                const result = await jarvis.execute(agent, action, params);
                addMessage('dashboard', agent, 'execute', { action, result });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (path === '/api/swarm' && req.method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', async () => {
            try {
                const { tasks } = JSON.parse(body);
                const results = await jarvis.swarm(tasks);
                addMessage('dashboard', 'swarm', 'batch', { taskCount: tasks.length, results });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // --- Serve Dashboard Static Files ---
    let filePath = path === '/' ? '/index.html' : path;
    const fullPath = join(DASHBOARD_DIR, filePath);

    if (existsSync(fullPath)) {
        const ext = extname(fullPath);
        const mime = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(readFileSync(fullPath));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

async function main() {
    console.log('🐝 [SWARM] Starting Jarvis Swarm API...');
    try {
        await jarvis.boot();
    } catch (e) {
        console.log(`⚠️  [SWARM] Boot with warnings: ${e.message}`);
        jarvis.status = 'degraded';
    }
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`🌐 Painel:   http://127.0.0.1:${PORT}`);
        console.log(`📡 API:      http://127.0.0.1:${PORT}/api/status`);
        console.log(`🐝 Enxame:   http://127.0.0.1:${PORT}/api/swarm`);
    });
}

main();
