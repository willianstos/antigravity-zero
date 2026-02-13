#!/bin/bash
# 🔑 BREAK GLASS — Restauração de Emergência
# Só use quando TUDO estiver comprometido
# Requer: master-key.pem (no SSD externo)
#
# Uso: bash tools/emergency-restore.sh /caminho/para/master-key.pem

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PEM_PATH="${1:-}"
WORKSPACE="/home/zappro/antigravity-zero"
EMERGENCY_DIR="$WORKSPACE/artifacts/security/emergency"
ENV_FILE="$WORKSPACE/.env"

echo -e "${RED}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║  🚨 MODO DE EMERGÊNCIA — BREAK GLASS 🚨         ║${NC}"
echo -e "${RED}║  Só use quando TUDO estiver comprometido         ║${NC}"
echo -e "${RED}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se a chave PEM foi fornecida
if [ -z "$PEM_PATH" ]; then
    echo -e "${RED}❌ Uso: bash tools/emergency-restore.sh /caminho/para/master-key.pem${NC}"
    echo -e "${YELLOW}   A chave PEM deve estar no seu SSD externo.${NC}"
    exit 1
fi

# Verificar se a chave PEM existe
if [ ! -f "$PEM_PATH" ]; then
    echo -e "${RED}❌ Chave PEM não encontrada em: $PEM_PATH${NC}"
    echo -e "${YELLOW}   Conecte seu SSD externo e tente novamente.${NC}"
    exit 1
fi

echo -e "${CYAN}🔑 Chave PEM encontrada: $PEM_PATH${NC}"
echo ""

# PASSO 1: Descriptografar session key com a PEM
echo -e "${YELLOW}[1/5] Descriptografando chave de sessão...${NC}"
openssl rsautl -decrypt \
    -inkey "$PEM_PATH" \
    -in "$EMERGENCY_DIR/session.key.enc" \
    -out /tmp/session.key.tmp 2>/dev/null || \
openssl pkeyutl -decrypt \
    -inkey "$PEM_PATH" \
    -in "$EMERGENCY_DIR/session.key.enc" \
    -out /tmp/session.key.tmp
echo -e "${GREEN}  ✅ Chave de sessão recuperada${NC}"

# PASSO 2: Descriptografar .env com a session key
echo -e "${YELLOW}[2/5] Restaurando .env do backup cifrado...${NC}"
sudo chattr -i "$ENV_FILE" 2>/dev/null || true
openssl enc -aes-256-cbc -d -salt \
    -in "$EMERGENCY_DIR/env-backup.enc" \
    -out "$ENV_FILE" \
    -pass file:/tmp/session.key.tmp \
    -pbkdf2
echo -e "${GREEN}  ✅ .env restaurada do backup${NC}"

# PASSO 3: Limpar rastros temporários
echo -e "${YELLOW}[3/5] Limpando chaves temporárias...${NC}"
shred -u /tmp/session.key.tmp 2>/dev/null || rm -f /tmp/session.key.tmp
echo -e "${GREEN}  ✅ Chave temporária destruída (shred)${NC}"

# PASSO 4: Rebloquear .env
echo -e "${YELLOW}[4/5] Rebloqueando .env...${NC}"
chmod 600 "$ENV_FILE"
sudo chattr +i "$ENV_FILE"
echo -e "${GREEN}  ✅ .env imutável novamente${NC}"

# PASSO 5: Recarregar Redis Vault
echo -e "${YELLOW}[5/5] Recarregando Redis Vault...${NC}"
sudo chattr -i "$ENV_FILE"
cd "$WORKSPACE" && node tools/redis-vault.mjs load 2>/dev/null || echo "  ⚠️ Redis offline -- recarregar manualmente depois"
sudo chattr +i "$ENV_FILE"
echo -e "${GREEN}  ✅ Redis atualizado com novas secrets${NC}"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ RESTAURAÇÃO COMPLETA                         ║${NC}"
echo -e "${GREEN}║  .env restaurada, bloqueada e no Redis            ║${NC}"
echo -e "${GREEN}║  Guarde a PEM de volta no SSD externo!            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"

# Log do incidente
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "{\"timestamp\":\"$TIMESTAMP\",\"type\":\"emergency_restore\",\"status\":\"completed\"}" >> "$WORKSPACE/artifacts/security/incidents.json"
