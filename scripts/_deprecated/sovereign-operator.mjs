#!/usr/bin/env node
/**
 * 🔄 Sovereign Operator - Argo-Like Reconciler
 * Sincroniza o cluster com o GitHub (Source of Truth).
 */
import { execSync } from 'child_process';
import fs from 'fs';

const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';
const REPO_PATH = '/home/zappro/antigravity-zero';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} OPERATOR "${escapedMsg}"`);
    } catch (e) {}
}

async function reconcile() {
    logIAM("🔄 Operador Argo-Like Iniciado. Verificando GitHub...");

    try {
        // 1. Fetch remoto
        execSync("git fetch origin main");
        
        // 2. Detectar se há mudanças locais vs remotas
        const status = execSync("git status -uno").toString();
        
        if (status.includes("Your branch is behind")) {
            logIAM("🚨 DIVERGÊNCIA DETECTADA! Cluster desatualizado. Reconciliando...");
            
            // 3. Puxar mudanças
            execSync("git pull origin main");
            logIAM("✅ Código atualizado via GitOps.");

            // 4. Disparar Gatilhos de Reconciliação
            logIAM("⚡ Disparando auditorias de estado pós-pull...");
            execSync("node bin/skill-auditor.mjs");
            execSync("node bin/iac-auditor.mjs");
            execSync("node bin/auto-repair.mjs");
            
            logIAM("✨ Cluster reconciliado com sucesso. Estado = GitHub.");
        } else {
            logIAM("✅ Estado local em sincronia com o GitHub. Nenhuma ação necessária.");
        }
    } catch (e) {
        logIAM("❌ Erro no Operador de Reconciliação: " + e.message);
    }
}

reconcile();
