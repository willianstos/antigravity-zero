#!/bin/bash
# Antigravity Desktop - MCP Bridge v2026.1
# Otimizado para latência ultra-baixa entre nós H1 e H2

SERVER_PATH="/home/zappro/antigravity-zero/bin/desktop-control-mcp.mjs"
LOG_FILE="/home/zappro/antigravity-zero/artifacts/mcp-bridge.log"

# 1. Configuração de Prioridade (Real-time priority para reduzir jitter)
NICENESS=-10

echo "[$(date)] Iniciando MCP Bridge para Antigravity Desktop..." >> $LOG_FILE

# 2. Verificação de Dependências
if ! command -v node &> /dev/null; then
    echo "❌ Erro: Node.js não encontrado. Abortando." >> $LOG_FILE
    exit 1
fi

# 3. Execução do Servidor MCP com transporte STDIO
nice -n $NICENESS node $SERVER_PATH \
    --transport stdio \
    --desktop-node H2 \
    2>> $LOG_FILE

# 4. Auto-restart em caso de falha
if [ $? -ne 0 ]; then
    echo "⚠️ MCP Bridge caiu. Reiniciando em 2 segundos..." >> $LOG_FILE
    sleep 2
    exec "$0" "$@"
fi
