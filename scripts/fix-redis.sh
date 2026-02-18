#!/bin/bash
# ================================================
# 🔐 REDIS FIX — Descobre senha e atualiza .env
# Uso: sudo bash scripts/fix-redis.sh
# ================================================
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "🔐 Descobrindo senha do Redis..."
REDIS_PASS=$(grep "^requirepass" /etc/redis/redis.conf 2>/dev/null | awk '{print $2}')

if [ -z "$REDIS_PASS" ]; then
    echo "ℹ️  Redis não tem requirepass — testando sem senha..."
    REDIS_PASS=""
fi

# Testa conexão
if [ -n "$REDIS_PASS" ]; then
    TEST=$(redis-cli -a "$REDIS_PASS" ping 2>/dev/null)
    REDIS_URL="redis://:${REDIS_PASS}@127.0.0.1:6379"
else
    TEST=$(redis-cli ping 2>/dev/null)
    REDIS_URL="redis://127.0.0.1:6379"
fi

if [ "$TEST" = "PONG" ]; then
    echo "✅ Redis: PONG"
    echo "🔑 Senha: ${REDIS_PASS:-<sem senha>}"
    echo "🔗 URL:   $REDIS_URL"

    # Atualiza .env
    if grep -q "^REDIS_URL=" "$ROOT/.env"; then
        sed -i "s|^REDIS_URL=.*|REDIS_URL=\"${REDIS_URL}\"|" "$ROOT/.env"
        # Remove comentários de redis acima
        sed -i '/^# ⚠️  Redis tem senha/d' "$ROOT/.env"
        sed -i '/^# Depois substitua SENHA_REDIS/d' "$ROOT/.env"
    else
        echo "REDIS_URL=\"${REDIS_URL}\"" >> "$ROOT/.env"
    fi
    echo "✅ .env atualizado!"

    # Carrega vault
    echo ""
    echo "📦 Carregando secrets no Redis Vault..."
    cd "$ROOT"
    node src/backend/src/redis-vault.mjs load 2>&1 || echo "⚠️ Vault load falhou (não crítico)"

    echo ""
    echo "✅ Redis configurado com sucesso!"
else
    echo "❌ Redis não respondeu: $TEST"
    echo "   Verifique: systemctl status redis-server"
    exit 1
fi
