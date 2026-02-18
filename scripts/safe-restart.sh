#!/bin/bash
# safe-restart.sh — Reinicia apenas os serviços do Jarvis (Bot + Swarm)
# SEM matar o VS Code ou o terminal!

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== [SAFE RESTART] Iniciando reinicialização segura do Jarvis ===${NC}"
echo "Data: $(date)"

# 1. Matar processos ESPECÍFICOS (nada de pkill node!)
echo -e "\n${GREEN}1. Parando serviços antigos...${NC}"

# Matar Bot
if pgrep -f "src/core/telegram-bot.js" > /dev/null; then
    echo "Encontrado Bot antigo. Matando..."
    pkill -f "src/core/telegram-bot.js"
else
    echo "Bot já estava parado."
fi

# Matar Swarm
if pgrep -f "src/jarvis/swarm-server.mjs" > /dev/null; then
    echo "Encontrado Swarm antigo. Matando..."
    pkill -f "src/jarvis/swarm-server.mjs"
else
    echo "Swarm já estava parado."
fi

# Aguardar liberação da porta
echo -e "\n${GREEN}2. Verificando porta 7777...${NC}"
sleep 2
if lsof -i :7777 > /dev/null; then
    echo -e "${RED}ERRO: Porta 7777 ainda em uso! Tentando forçar kill no processo da porta...${NC}"
    fuser -k 7777/tcp
    sleep 1
fi

# 3. Iniciar Swarm
echo -e "\n${GREEN}3. Iniciando Swarm Server...${NC}"
nohup npm run swarm > logs/swarm.log 2>&1 &
SWARM_PID=$!
echo "Swarm iniciado (PID: $SWARM_PID). Logs em logs/swarm.log"

# Aguardar Swarm subir
echo "Aguardando 5 segundos para o Swarm estabilizar..."
sleep 5

# Verificar se Swarm ainda está rodando
if ! ps -p $SWARM_PID > /dev/null; then
    echo -e "${RED}ERRO: Swarm morreu logo após iniciar! Verifique logs/swarm.log${NC}"
    cat logs/swarm.log | tail -n 10
    exit 1
fi

# 4. Iniciar Bot
echo -e "\n${GREEN}4. Iniciando Telegram Bot...${NC}"
nohup npm run bot > logs/bot.log 2>&1 &
BOT_PID=$!
echo "Bot iniciado (PID: $BOT_PID). Logs em logs/bot.log"

# Aguardar Bot
sleep 3
if ! ps -p $BOT_PID > /dev/null; then
    echo -e "${RED}ERRO: Bot morreu logo após iniciar! Verifique logs/bot.log${NC}"
    cat logs/bot.log | tail -n 10
    exit 1
fi

echo -e "\n${GREEN}=== [SUCCESS] Jarvis reiniciado com sucesso! ===${NC}"
echo "Swarm PID: $SWARM_PID"
echo "Bot PID:   $BOT_PID"
