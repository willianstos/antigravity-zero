#!/usr/bin/env node
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const IAM_LOG = path.join(__dirname, '../artifacts/swarm-iam.jsonl');

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dashboard')));
app.use('/artifacts', express.static(path.join(__dirname, '../artifacts')));

let visionState = {
    window: "Nenhum",
    timestamp: new Date().toISOString(),
    image: ""
};

app.post('/api/update-vision', (req, res) => {
    visionState = {
        window: req.body.window || "Nenhum",
        timestamp: req.body.timestamp || new Date().toISOString(),
        image: req.body.image || ""
    };
    res.json({ status: "ok" });
});

app.get('/api/vision', (req, res) => {
    res.json(visionState);
});

app.get('/api/status', (req, res) => {
    try {
        if (!fs.existsSync(IAM_LOG)) return res.json({ tasks: [] });

        const lines = fs.readFileSync(IAM_LOG, 'utf8').trim().split('\n');
        const tasks = {};

        lines.forEach(line => {
            const entry = JSON.parse(line);
            if (!tasks[entry.cardId]) {
                tasks[entry.cardId] = { id: entry.cardId, status: "Thinking", lastUpdate: "", comments: [] };
            }

            if (entry.message.includes("Iniciando")) tasks[entry.cardId].status = "Thinking";
            if (entry.message.includes("🛠️")) tasks[entry.cardId].status = "Building";
            if (entry.message.includes("🛡️")) tasks[entry.cardId].status = "Auditing";
            if (entry.message.includes("✅")) tasks[entry.cardId].status = "Deployed";
            if (entry.message.includes("❌")) tasks[entry.cardId].status = "Failed";

            tasks[entry.cardId].lastUpdate = entry.timestamp;
            tasks[entry.cardId].comments.push({ agent: entry.agent, msg: entry.message, time: entry.timestamp });
        });

        res.json({
            meta: {
                ceo_goals: [
                    "Maximizar faturamento via Automação Agêntica",
                    "Soberania total do Cluster H2",
                    "Resposta zero-delay em suporte HVAC"
                ]
            },
            tasks: Object.values(tasks)
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log("🚀 Sovereign Dashboard rodando em http://localhost:" + PORT);
});
