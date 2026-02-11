#!/bin/bash
# 🚀 OpenClaw Auto-Fix v1.0
# Resolve crash loop e gateway zumbi automaticamente
# Uso: bash tools/openclaw-fix.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 [OpenClaw Fix] Diagnóstico e reparo automático...${NC}"
echo ""

# 1. Verificar status atual
echo -e "${YELLOW}[1/4] Verificando status...${NC}"
STATUS=$(sudo systemctl is-active openclaw.service 2>/dev/null || echo "inactive")
echo -e "  Status: ${STATUS}"

if [ "$STATUS" = "active" ]; then
    echo -e "${GREEN}  ✅ OpenClaw já está rodando!${NC}"
    sudo systemctl status openclaw.service --no-pager -l 2>/dev/null | tail -5
    echo ""
    echo -e "${GREEN}Tudo OK! Nada a corrigir.${NC}"
    exit 0
fi

# 2. Matar gateway zumbi
echo -e "${YELLOW}[2/4] Matando gateway zumbi...${NC}"
ZOMBIE_PID=$(sudo lsof -ti :18789 2>/dev/null || echo "")
if [ -n "$ZOMBIE_PID" ]; then
    echo -e "${RED}  🧟 Gateway zumbi encontrado: PID $ZOMBIE_PID${NC}"
    sudo kill -9 $ZOMBIE_PID 2>/dev/null || true
    echo -e "${GREEN}  ✅ Zumbi eliminado${NC}"
else
    echo -e "${GREEN}  ✅ Nenhum zumbi na porta 18789${NC}"
fi

# 3. Parar gateway pelo CLI
echo -e "${YELLOW}[3/4] Parando gateway via CLI...${NC}"
openclaw gateway stop 2>/dev/null || true
sleep 2
echo -e "${GREEN}  ✅ Gateway parado${NC}"

# 4. Reiniciar service
echo -e "${YELLOW}[4/4] Reiniciando service...${NC}"
sudo systemctl restart openclaw.service
sleep 4

# Verificar resultado
FINAL_STATUS=$(sudo systemctl is-active openclaw.service 2>/dev/null || echo "failed")
echo ""
if [ "$FINAL_STATUS" = "active" ]; then
    echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ OpenClaw RESTAURADO com sucesso!  ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
    sudo systemctl status openclaw.service --no-pager -l 2>/dev/null | tail -5
else
    echo -e "${RED}╔══════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ Falha ao restaurar. Ver logs:     ║${NC}"
    echo -e "${RED}║  sudo journalctl -u openclaw -n 30   ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════╝${NC}"
fi
