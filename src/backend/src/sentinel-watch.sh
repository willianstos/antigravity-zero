#!/bin/bash
# 🕵️ Sentinel Watch v1.0 — Anti-Keylogger & Anti-Exfiltração
# Monitora processos suspeitos que podem roubar secrets do ambiente

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

INCIDENTS_DIR="artifacts/security"
mkdir -p "$INCIDENTS_DIR"

echo -e "${CYAN}🕵️ [Sentinel] Iniciando varredura de segurança do sistema...${NC}"
echo ""
THREATS=0

# ─────────────────────────────────────────
# 1. Detectar keyloggers conhecidos
# ─────────────────────────────────────────
echo -e "${YELLOW}[1/6] Verificando keyloggers...${NC}"
KEYLOGGER_PROCS=("xinput" "xdotool" "xev" "logkeys" "lkl" "pykeylogger" "keylogger" "xspy" "snoopy")
for proc in "${KEYLOGGER_PROCS[@]}"; do
    if pgrep -x "$proc" > /dev/null 2>&1; then
        echo -e "${RED}  🚨 KEYLOGGER DETECTADO: $proc (PID: $(pgrep -x $proc))${NC}"
        THREATS=$((THREATS + 1))
    fi
done
if [ $THREATS -eq 0 ]; then
    echo -e "${GREEN}  ✅ Nenhum keylogger conhecido detectado${NC}"
fi

# ─────────────────────────────────────────
# 2. Verificar processos escutando input
# ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[2/6] Verificando processos monitorando input de teclado...${NC}"
XINPUT_SNIFFERS=$(xinput list 2>/dev/null | grep -i "keyboard" | wc -l || echo "0")
echo -e "${CYAN}  📋 Dispositivos de teclado ativos: $XINPUT_SNIFFERS${NC}"

# Verificar se algum processo está lendo /dev/input
INPUT_READERS=$(lsof /dev/input/event* 2>/dev/null | grep -v "Xorg\|gnome\|gdm\|systemd" | head -5 || true)
if [ -n "$INPUT_READERS" ]; then
    echo -e "${RED}  🚨 Processos suspeitos lendo input de teclado:${NC}"
    echo "$INPUT_READERS"
    THREATS=$((THREATS + 1))
else
    echo -e "${GREEN}  ✅ Nenhum processo suspeito lendo input${NC}"
fi

# ─────────────────────────────────────────
# 3. Conexões de rede suspeitas
# ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/6] Verificando conexões de rede suspeitas...${NC}"

# Conexões saindo para IPs desconhecidos (excluir localhost, LAN, DNS conhecidos)
SUSPICIOUS_CONNS=$(ss -tnp 2>/dev/null | grep ESTAB | grep -v "127.0.0.1\|::1\|192.168\|10.0\|172.16" | head -10 || true)
CONN_COUNT=$(echo "$SUSPICIOUS_CONNS" | grep -c "ESTAB" 2>/dev/null || echo "0")
echo -e "${CYAN}  📡 Conexões externas ativas: $CONN_COUNT${NC}"
if [ "$CONN_COUNT" -gt 20 ]; then
    echo -e "${RED}  🚨 Número alto de conexões externas! Possível exfiltração.${NC}"
    THREATS=$((THREATS + 1))
else
    echo -e "${GREEN}  ✅ Conexões dentro do normal${NC}"
fi

# ─────────────────────────────────────────
# 4. Arquivos suspeitos em /tmp
# ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[4/6] Verificando arquivos suspeitos em /tmp...${NC}"

# Procurar por dumps de memória ou arquivos com padrões de secrets
SUSPECT_FILES=$(find /tmp -maxdepth 2 -name "*.dump" -o -name "*.key" -o -name "*.pem" -o -name "*secret*" -o -name "*password*" -o -name "*credential*" 2>/dev/null | head -10 || true)
if [ -n "$SUSPECT_FILES" ]; then
    echo -e "${RED}  🚨 Arquivos suspeitos encontrados em /tmp:${NC}"
    echo "$SUSPECT_FILES" | head -5
    THREATS=$((THREATS + 1))
else
    echo -e "${GREEN}  ✅ Nenhum arquivo suspeito em /tmp${NC}"
fi

# ─────────────────────────────────────────
# 5. Verificar permissões do .env
# ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[5/6] Verificando permissões da .env (joia da coroa)...${NC}"
ENV_FILE="$HOME/antigravity-zero/.env"
if [ -f "$ENV_FILE" ]; then
    PERMS=$(stat -c '%a' "$ENV_FILE")
    OWNER=$(stat -c '%U' "$ENV_FILE")
    if [ "$PERMS" != "600" ]; then
        echo -e "${RED}  🚨 .env com permissões $PERMS (deveria ser 600). Corrigindo...${NC}"
        chmod 600 "$ENV_FILE"
        echo -e "${GREEN}  ✅ Permissões corrigidas para 600 (só dono lê/escreve)${NC}"
        THREATS=$((THREATS + 1))
    else
        echo -e "${GREEN}  ✅ .env com permissões corretas (600)${NC}"
    fi
    echo -e "${CYAN}  👤 Dono: $OWNER${NC}"
else
    echo -e "${RED}  ❌ .env não encontrada!${NC}"
fi

# ─────────────────────────────────────────
# 6. Verificar Redis (porteiro)
# ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[6/6] Verificando fortificação do Redis (porteiro)...${NC}"

# Redis está rodando?
if systemctl is-active redis-server > /dev/null 2>&1 || systemctl is-active redis > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ Redis: ONLINE${NC}"
    
    # Verificar bind (deve ser apenas localhost)
    REDIS_BIND=$(redis-cli CONFIG GET bind 2>/dev/null | tail -1 || echo "unknown")
    if echo "$REDIS_BIND" | grep -q "0.0.0.0"; then
        echo -e "${RED}  🚨 Redis exposto em 0.0.0.0! Deveria ser 127.0.0.1${NC}"
        THREATS=$((THREATS + 1))
    else
        echo -e "${GREEN}  ✅ Redis bind: $REDIS_BIND (seguro)${NC}"
    fi
    
    # Verificar se requirepass está ativo
    REDIS_AUTH=$(redis-cli CONFIG GET requirepass 2>/dev/null | tail -1 || echo "")
    if [ -z "$REDIS_AUTH" ] || [ "$REDIS_AUTH" = "" ]; then
        echo -e "${YELLOW}  ⚠️  Redis sem senha (requirepass). Recomendo configurar!${NC}"
    else
        echo -e "${GREEN}  ✅ Redis protegido com senha${NC}"
    fi
    
    # Verificar se protected-mode está ativo
    REDIS_PROTECTED=$(redis-cli CONFIG GET protected-mode 2>/dev/null | tail -1 || echo "unknown")
    echo -e "${CYAN}  🛡️ Protected-mode: $REDIS_PROTECTED${NC}"
else
    echo -e "${RED}  ❌ Redis OFFLINE! Porteiro caiu! Iniciar com: sudo systemctl start redis-server${NC}"
    THREATS=$((THREATS + 1))
fi

# ─────────────────────────────────────────
# Relatório Final
# ─────────────────────────────────────────
echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
if [ $THREATS -eq 0 ]; then
    echo -e "${GREEN}🛡️ [Sentinel] SISTEMA LIMPO. Zero ameaças. Honra intacta!${NC}"
else
    echo -e "${RED}🚨 [Sentinel] $THREATS AMEAÇA(S) DETECTADA(S)! Ação necessária.${NC}"
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "{\"timestamp\":\"$TIMESTAMP\",\"type\":\"sentinel_scan\",\"threats\":$THREATS}" >> "$INCIDENTS_DIR/incidents.json"
fi
echo -e "${CYAN}═══════════════════════════════════════════${NC}"

exit $THREATS
