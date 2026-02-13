#!/bin/bash
# 🦅 Jarvis Hot-Key Capture v2026.1
# Dispara auditoria imediata da janela ativa

IAM_LOGGER="/home/zappro/antigravity-zero/bin/iam-logger.mjs"
SCREENSHOT_DIR="/home/zappro/antigravity-zero/artifacts"
DATE=$(date +%Y%m%d_%H%M%S)
PATH_IMG="$SCREENSHOT_DIR/hotkey_$DATE.png"

echo "🎯 Hot-Key Pressionada! Capturando visão..."
scrot -u "$PATH_IMG" # Captura a janela ativa (-u)

node "$IAM_LOGGER" SENTINEL "🎯 Visão Imediata (Hot-Key) capturada: $PATH_IMG. Enviando para análise PH-13."

# Aqui poderíamos disparar o Qwen2 Omni via API local se estiver rodando
# curl -X POST http://localhost:8000/vision-analyze ...

echo "✅ Missão enviada ao enxame."
