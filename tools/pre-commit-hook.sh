#!/bin/bash
# 🔐 Pre-Commit Hook — Guardião de Secrets
# Bloqueia commits que contenham padrões de secrets

echo "🔐 [Guardião] Verificando commit por secrets expostas..."

# Executar o scanner apenas nos arquivos staged
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
    echo "✅ Nenhum arquivo staged."
    exit 0
fi

FOUND=0

PATTERNS=(
    'sk-[a-zA-Z0-9]{20,}'
    'pk-[a-zA-Z0-9]{20,}'
    'ghp_[a-zA-Z0-9]{36,}'
    'ghs_[a-zA-Z0-9]{36,}'
    'AKIA[0-9A-Z]{16}'
    '[0-9]+:AA[a-zA-Z0-9_-]{33}'
    'eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*'
    'BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY'
)

for file in $STAGED_FILES; do
    # Ignorar arquivos binários e o próprio .env.example
    if [[ "$file" == *.env.example ]] || [[ "$file" == *.png ]] || [[ "$file" == *.jpg ]]; then
        continue
    fi

    for pattern in "${PATTERNS[@]}"; do
        if git diff --cached "$file" 2>/dev/null | grep -qE "$pattern"; then
            echo "🚨 [BLOQUEADO] Secret detectada em: $file (padrão: $pattern)"
            FOUND=$((FOUND + 1))
        fi
    done
done

if [ $FOUND -gt 0 ]; then
    echo ""
    echo "❌ [Guardião] COMMIT BLOQUEADO! $FOUND secret(s) detectada(s)."
    echo "   Remova as secrets e tente novamente."
    echo "   Dica: use 'git diff --cached' para ver o que está sendo commitado."
    exit 1
else
    echo "✅ [Guardião] Commit limpo. Nenhuma secret detectada. Honra mantida! 🛡️"
    exit 0
fi
