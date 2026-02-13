#!/bin/bash
# Antigravity Sentinel - Auto-Trigger de Visão v2026.1

LOG_MONITOR="journalctl -u k3s -f"
CRITICAL_PATTERN="level=fatal|level=panic|error|failed"
# Usando o comando de sistema do OpenClaw para enviar comando de screenshot
SKILL_CMD="echo 'Erro crítico detectado no K3s. Analisando...' | node /home/zappro/antigravity-zero/bin/iam-logger.mjs SENTINEL"

echo "[$(date)] Sentinela Antigravity ativo. Monitorando logs do Cluster..."

$LOG_MONITOR | while read LINE; do
    if echo "$LINE" | grep -Ei "$CRITICAL_PATTERN" > /dev/null; then
        echo "⚠️ PADRÃO CRÍTICO DETECTADO: $LINE"
        eval "$SKILL_CMD"
        # Snapshot via Dashboard
        curl -X POST http://localhost:3000/api/event -d "{\"agent\": \"SENTINEL\", \"message\": \"⚠️ Erro crítico K3s detectado! Iniciando auditoria visual.\"}" -H "Content-Type: application/json"
    fi
done
