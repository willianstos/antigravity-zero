#!/usr/bin/env node
/**
 * 🏗️ IaC Auditor - Configuration Drift Detection
 * Garante que o estado real no LocalStack bate com o GitHub.
 */
import { execSync } from 'child_process';
import fs from 'fs';

const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';
const IAC_PATH = '/home/zappro/antigravity-zero/infra/monitoring';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} IAC_AUDITOR "${escapedMsg}"`);
    } catch (e) { }
}

async function auditIaC() {
    logIAM("🏗️ Auditoria IaC Iniciada. Verificando Drift no LocalStack...");

    try {
        // 1. Verificar se o Terraform está inicializado
        if (!fs.existsSync(`${IAC_PATH}/.terraform`)) {
            logIAM("⚠️ Terraform não inicializado no diretório de monitoramento.");
            return;
        }

        // 2. Rodar Plan para checar Drift
        const plan = execSync(`terraform -chdir=${IAC_PATH} plan -no-color`).toString();

        if (plan.includes("No changes. Your infrastructure matches the configuration.")) {
            logIAM("✅ IaC Sincronizado: Estado Real = GitHub. Soberania intacta.");
        } else {
            logIAM("🚨 CONFIGURATION DRIFT DETECTADO! Infraestrutura real divergiu do código.");
            console.log(plan);
        }
    } catch (e) {
        logIAM("❌ Erro na Auditoria IaC: " + e.message);
    }
}

auditIaC();
