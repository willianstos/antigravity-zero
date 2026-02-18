#!/bin/bash
# ================================================
# 🚀 OPEN CLAW BASE SETUP — One-Shot Script
# Executa: systemd services + Redis Vault
# Uso: sudo bash scripts/setup-base.sh
# ================================================
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "📁 Root: $ROOT"

# ── PASSO 1: Serviços systemd ──────────────────
echo ""
echo "🔧 [1/3] Instalando serviços systemd..."
cp "$ROOT/infra/systemd/jarvis-swarm.service" /etc/systemd/system/
cp "$ROOT/infra/systemd/openclaw-bot.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable jarvis-swarm openclaw-bot
echo "✅ Serviços registrados (enable). Para iniciar agora: systemctl start jarvis-swarm openclaw-bot"

# ── PASSO 2: Descobrir senha do Redis ──────────
echo ""
echo "🔐 [2/3] Verificando Redis..."
REDIS_PASS=$(grep "^requirepass" /etc/redis/redis.conf 2>/dev/null | awk '{print $2}')

if [ -z "$REDIS_PASS" ]; then
    echo "⚠️  Senha não encontrada em /etc/redis/redis.conf"
    echo "   Tentando sem senha..."
    REDIS_TEST=$(redis-cli ping 2>/dev/null)
else
    echo "✅ Senha encontrada no redis.conf"
    REDIS_TEST=$(redis-cli -a "$REDIS_PASS" ping 2>/dev/null)
fi

if [ "$REDIS_TEST" = "PONG" ]; then
    echo "✅ Redis respondendo: PONG"
    # Atualizar .env com a URL correta
    if [ -n "$REDIS_PASS" ]; then
        # Atualiza ou adiciona REDIS_URL
        if grep -q "^REDIS_URL=" "$ROOT/.env"; then
            sed -i "s|^REDIS_URL=.*|REDIS_URL=redis://:${REDIS_PASS}@127.0.0.1:6379|" "$ROOT/.env"
        else
            echo "REDIS_URL=redis://:${REDIS_PASS}@127.0.0.1:6379" >> "$ROOT/.env"
        fi
        echo "✅ REDIS_URL atualizado no .env"
    fi
else
    echo "❌ Redis não respondeu. Verifique: systemctl status redis-server"
    exit 1
fi

# ── PASSO 3: Carregar Vault ────────────────────
echo ""
echo "🔐 [3/3] Carregando secrets no Redis Vault..."
cd "$ROOT"
node src/backend/src/redis-vault.mjs load

echo ""
echo "════════════════════════════════════════"
echo "✅ SETUP COMPLETO!"
echo "   • Serviços: systemctl start jarvis-swarm openclaw-bot"
echo "   • Vault: node src/backend/src/redis-vault.mjs list"
echo "   • Bot: npm run bot"
echo "════════════════════════════════════════"
