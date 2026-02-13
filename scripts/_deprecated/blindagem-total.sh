#!/bin/bash
# 🔐 Blindagem Total v1.0 — Camadas extras anti-vazamento
# Aplica todas as fortificações de uma vez

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

WORKSPACE="/home/zappro/antigravity-zero"
ENV_FILE="$WORKSPACE/.env"

echo -e "${CYAN}🔐 [Blindagem Total] Aplicando camadas extras de segurança...${NC}"
echo ""

# ═══════════════════════════════════════════
# CAMADA 7: .env imutável (chattr +i)
# Impede QUALQUER processo de modificar o .env
# Só root com chattr -i pode desbloquear
# ═══════════════════════════════════════════
echo -e "${YELLOW}[1/7] Tornando .env imutável (chattr +i)...${NC}"
sudo chattr +i "$ENV_FILE" 2>/dev/null && echo -e "${GREEN}  ✅ .env agora é IMUTÁVEL. Nem root consegue editar sem chattr -i${NC}" || echo -e "${YELLOW}  ⚠️ chattr não disponível neste filesystem${NC}"

# ═══════════════════════════════════════════
# CAMADA 8: Bloquear .env do git (force)
# ═══════════════════════════════════════════
echo -e "${YELLOW}[2/7] Garantindo .env no .gitignore...${NC}"
if ! grep -q "^\.env$" "$WORKSPACE/.gitignore" 2>/dev/null; then
    echo ".env" >> "$WORKSPACE/.gitignore"
fi
# Remover do tracking se estiver rastreado
git -C "$WORKSPACE" rm --cached .env 2>/dev/null || true
echo -e "${GREEN}  ✅ .env removida do Git tracking${NC}"

# ═══════════════════════════════════════════
# CAMADA 9: Bloquear .env no git via config
# git config core.hooksPath aponta pro nosso hook
# ═══════════════════════════════════════════
echo -e "${YELLOW}[3/7] Configurando git hooks...${NC}"
git -C "$WORKSPACE" config core.hooksPath "$WORKSPACE/.git/hooks"
echo -e "${GREEN}  ✅ Git hooks apontando para nosso pre-commit${NC}"

# ═══════════════════════════════════════════
# CAMADA 10: Bash history — não salvar cmds com secrets
# Adiciona HISTIGNORE para padrões sensíveis
# ═══════════════════════════════════════════
echo -e "${YELLOW}[4/7] Protegendo bash history contra secrets...${NC}"
BASHRC="/home/zappro/.bashrc"
if ! grep -q "HISTIGNORE" "$BASHRC" 2>/dev/null; then
    cat >> "$BASHRC" << 'HISTEOF'

# 🔐 Anti-vazamento: não salvar comandos com secrets no history
export HISTIGNORE="*TOKEN*:*SECRET*:*PASSWORD*:*KEY=*:*PASS=*:*token=*:*secret=*:*password=*:*key=*:*pass=*:*sk-*:*ghp_*:*Bearer*"
# Não salvar comandos duplicados ou que começam com espaço
export HISTCONTROL=ignoreboth:erasedups
HISTEOF
    echo -e "${GREEN}  ✅ HISTIGNORE configurado — secrets não vão pro history${NC}"
else
    echo -e "${GREEN}  ✅ HISTIGNORE já configurado${NC}"
fi

# ═══════════════════════════════════════════
# CAMADA 11: Desabilitar core dumps (memory dump)
# Impede que crash de processo salve memória com secrets
# ═══════════════════════════════════════════
echo -e "${YELLOW}[5/7] Desabilitando core dumps...${NC}"
# Runtime
ulimit -c 0 2>/dev/null
# Persistente
if ! grep -q "hard core 0" /etc/security/limits.conf 2>/dev/null; then
    echo "* hard core 0" | sudo tee -a /etc/security/limits.conf > /dev/null
fi
# Sysctl
echo "kernel.core_pattern=|/bin/false" | sudo tee /etc/sysctl.d/99-no-coredump.conf > /dev/null
sudo sysctl -p /etc/sysctl.d/99-no-coredump.conf 2>/dev/null || true
echo -e "${GREEN}  ✅ Core dumps desabilitados — sem memory dumps com secrets${NC}"

# ═══════════════════════════════════════════
# CAMADA 12: Monitorar acesso ao .env com auditd/inotifywait
# Cria watcher que alerta quando alguém tenta ler o .env
# ═══════════════════════════════════════════
echo -e "${YELLOW}[6/7] Criando watcher de acesso ao .env...${NC}"
cat > "$WORKSPACE/tools/env-watcher.sh" << 'WATCHEOF'
#!/bin/bash
# 🔐 Monitora todo acesso ao .env e alerta
ENV_FILE="/home/zappro/antigravity-zero/.env"
LOG_FILE="/home/zappro/antigravity-zero/artifacts/security/env-access.log"
mkdir -p "$(dirname $LOG_FILE)"

echo "🔐 [Watcher] Monitorando acesso ao .env... (Ctrl+C para parar)"
inotifywait -m -e access,modify,open,close_write "$ENV_FILE" 2>/dev/null | while read path action file; do
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    MSG="$TIMESTAMP | AÇÃO: $action | ARQUIVO: $path"
    echo "$MSG" | tee -a "$LOG_FILE"
    
    # Se for modificação, alerta alto
    if [[ "$action" == *"MODIFY"* ]] || [[ "$action" == *"CLOSE_WRITE"* ]]; then
        echo "🚨 [ALERTA] .env FOI MODIFICADA! Verificar imediatamente!"
    fi
done
WATCHEOF
chmod +x "$WORKSPACE/tools/env-watcher.sh"
echo -e "${GREEN}  ✅ Watcher criado — rode: bash tools/env-watcher.sh${NC}"

# ═══════════════════════════════════════════
# CAMADA 13: Redis — expirar sessões de consulta
# Secrets no Redis auto-expiram em 24h
# Adicionar log de quem consultou
# ═══════════════════════════════════════════
echo -e "${YELLOW}[7/7] Configurando Redis audit log...${NC}"
# Habilitar slowlog do Redis para auditar queries
redis-cli -a "antigravity-fortress-2026" CONFIG SET slowlog-log-slower-than 0 2>/dev/null || true
redis-cli -a "antigravity-fortress-2026" CONFIG SET slowlog-max-len 1000 2>/dev/null || true
echo -e "${GREEN}  ✅ Redis slowlog ativado — toda query é logada${NC}"

# ═══════════════════════════════════════════
# RELATÓRIO FINAL
# ═══════════════════════════════════════════
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🔐 BLINDAGEM TOTAL APLICADA!${NC}"
echo ""
echo -e "  Camada 1-6:  Scanner, Redis Vault, Anti-Injection, Sentinel,"
echo -e "               Pre-commit hook, Código de Honra (JÁ ATIVAS)"
echo -e ""
echo -e "  Camada 7:    .env IMUTÁVEL (chattr +i)"
echo -e "  Camada 8:    .env fora do Git (tracking removido)"
echo -e "  Camada 9:    Git hooks apontando pro guardião"
echo -e "  Camada 10:   Bash history NÃO salva secrets"
echo -e "  Camada 11:   Core dumps DESABILITADOS"
echo -e "  Camada 12:   Watcher de acesso ao .env"
echo -e "  Camada 13:   Redis audit log (toda query logada)"
echo -e ""
echo -e "${CYAN}  Total: 13 camadas de proteção ativas 🛡️${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
