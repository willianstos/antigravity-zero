#!/bin/bash
# 🛡️ JARVIS PRE-COMMIT HOOK — Blocks secrets from being committed
# Install: cp scripts/pre-commit-hook.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

# Build pattern from parts to avoid self-detection
P1="sk-proj-"
P2="sk-or-"
P3="pplx-"
P4="ghp_"
P5="AIzaSy"
SECRETS_PATTERN="(${P1}|${P2}|${P3}|${P4}|${P5})"

# Check staged files for secrets
STAGED=$(git diff --cached --name-only --diff-filter=ACM)

for FILE in $STAGED; do
    # Skip the hook script itself and example files
    if [[ "$FILE" == *"pre-commit"* ]] || [[ "$FILE" == *".example"* ]]; then
        continue
    fi

    if [[ "$FILE" == ".env" || "$FILE" == ".env."* ]]; then
        echo "❌ BLOQUEADO: Tentativa de commitar $FILE"
        echo "   → Use .env.example com placeholders."
        exit 1
    fi

    if git diff --cached "$FILE" | grep -qE "$SECRETS_PATTERN"; then
        echo "❌ BLOQUEADO: Secret detectado em $FILE"
        echo "   → Remova chaves reais antes de commitar."
        exit 1
    fi
done

echo "✅ Pre-commit: Nenhum secret detectado."
exit 0
