#!/usr/bin/env node
/**
 * 🔑 Google Antigravity OAuth Linker (v12.0)
 * Fornece as instruções para o Líder autenticar e liberar Gemini 3.
 */
import { execSync } from 'child_process';

const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} AUTH_MASTER "${escapedMsg}"`);
    } catch (e) { }
}

async function startOAuth() {
    logIAM("🔑 Iniciando Protocolo Google OAuth (Gemini 3 Pro)...");

    console.log("\n🌐 [AÇÃO REQUERIDA DO LÍDER]");
    console.log("----------------------------------------");
    console.log("Para liberar o poder do Gemini 3 no enxame, execute:");
    console.log("\n   openclaw configure --google-oauth\n");
    console.log("Isso abrirá o navegador para login local seguro.");
    console.log("----------------------------------------");

    logIAM("⏳ Aguardando autenticação do Líder via OpenClaw CLI.");
}

startOAuth();
