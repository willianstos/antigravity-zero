#!/usr/bin/env node
/**
 * 🛰️ Cluster Sentinel - Observabilidade Soberana
 * Agrega telemetria e calcula entropia.
 */
import { execSync } from 'child_process';
import fs from 'fs';

const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} SENTINEL "${escapedMsg}"`);
    } catch (e) { }
}

async function monitorCluster() {
    logIAM("🛰️ Sentinel Ativo. Escaneando Saúde do Cluster...");

    let stats = {
        k3s: "Offline",
        localstack: "Offline",
        mesh: "Disconnected",
        gpu_temp: 0,
        entropy: 0
    };

    try {
        // Check Mesh Status
        try {
            const meshInfo = execSync("tailscale status --json").toString();
            const meshPos = JSON.parse(meshInfo);
            stats.mesh = meshPos.BackendState === "Running" ? "Active" : "Idle";
        } catch (e) {
            stats.mesh = "Not Found";
        }

        // 1. Check LocalStack
        try {
            const lsStatus = execSync("docker inspect -f '{{.State.Status}}' localstack_refrimix").toString().trim();
            stats.localstack = lsStatus === "running" ? "Healthy" : "Failed";
        } catch (e) {
            stats.localstack = "Not Found";
        }

        // 2. Check GPU
        try {
            const gpuData = execSync("nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits").toString().trim();
            stats.gpu_temp = parseInt(gpuData);
        } catch (e) {
            stats.gpu_temp = -1;
        }

        // 3. Calculo de Entropia (Simulado base em logs de erro)
        try {
            const errorLogs = execSync("tail -n 100 /home/zappro/antigravity-zero/artifacts/swarm-iam.jsonl | grep ERROR | wc -l").toString().trim();
            stats.entropy = parseInt(errorLogs);
        } catch (e) {
            stats.entropy = 0;
        }

        logIAM(`📊 Saúde: LS=${stats.localstack} | GPU=${stats.gpu_temp}°C | Entropia=${stats.entropy}`);

        fs.writeFileSync('/home/zappro/antigravity-zero/artifacts/cluster_health.json', JSON.stringify(stats, null, 2));
    } catch (e) {
        logIAM("⚠️ Erro parcial na telemetria: " + e.message);
    }
}

monitorCluster();
