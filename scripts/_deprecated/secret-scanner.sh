#!/bin/bash
# 🔐 Secret Scanner v1.0 — Guardião de Secrets
# Pre-commit hook + Scanner manual
# Uso: bash tools/secret-scanner.sh [--fix]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

WORKSPACE="${1:-$(pwd)}"
INCIDENTS_DIR="artifacts/security"
INCIDENTS_FILE="$INCIDENTS_DIR/incidents.json"
FOUND=0

mkdir -p "$INCIDENTS_DIR"

echo -e "${YELLOW}🔐 [Guardião] Iniciando scan de secrets em: $WORKSPACE${NC}"

# Patterns de secrets conhecidos
PATTERNS=(
  'sk-[a-zA-Z0-9]{20,}'
  'pk-[a-zA-Z0-9]{20,}'
  'ghp_[a-zA-Z0-9]{36,}'
  'ghs_[a-zA-Z0-9]{36,}'
  'glpat-[a-zA-Z0-9\-]{20,}'
  'AKIA[0-9A-Z]{16}'
  'xoxb-[0-9]{11,13}-[a-zA-Z0-9-]+'
  '[0-9]+:AA[a-zA-Z0-9_-]{33}'
  'eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*'
  'password\s*=\s*["\x27][^"\x27]{3,}'
  'secret\s*=\s*["\x27][^"\x27]{3,}'
  'apikey\s*=\s*["\x27][^"\x27]{3,}'
  'api_key\s*=\s*["\x27][^"\x27]{3,}'
  'BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY'
  'Basic [a-zA-Z0-9+/=]{20,}'
)

# Arquivos a ignorar
IGNORE_DIRS=("node_modules" ".git" "artifacts/security" ".openclaw")

# Construir grep ignore flags
IGNORE_FLAGS=""
for dir in "${IGNORE_DIRS[@]}"; do
  IGNORE_FLAGS="$IGNORE_FLAGS --exclude-dir=$dir"
done

# Scan
for pattern in "${PATTERNS[@]}"; do
  RESULTS=$(grep -rnE $IGNORE_FLAGS "$pattern" "$WORKSPACE" \
    --include="*.js" --include="*.mjs" --include="*.ts" \
    --include="*.json" --include="*.md" --include="*.txt" \
    --include="*.yml" --include="*.yaml" --include="*.sh" \
    --include="*.env.example" --include="*.log" \
    2>/dev/null || true)
  
  if [ -n "$RESULTS" ]; then
    echo -e "${RED}🚨 [ALERTA] Padrão detectado: $pattern${NC}"
    echo "$RESULTS" | head -5
    FOUND=$((FOUND + 1))
  fi
done

# Verificar .env não está no git
if git -C "$WORKSPACE" ls-files --error-unmatch .env 2>/dev/null; then
  echo -e "${RED}🚨 [CRÍTICO] .env está sendo rastreado pelo Git! Remova imediatamente!${NC}"
  FOUND=$((FOUND + 1))
fi

# Verificar .gitignore tem .env
if ! grep -q "^\.env$" "$WORKSPACE/.gitignore" 2>/dev/null; then
  echo -e "${YELLOW}⚠️  [ATENÇÃO] .env não está no .gitignore${NC}"
fi

# Relatório
echo ""
if [ $FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ [Guardião] Nenhuma secret exposta detectada. Honra mantida! 🛡️${NC}"
else
  echo -e "${RED}❌ [Guardião] $FOUND padrão(s) suspeito(s) encontrado(s). DESONRA IMINENTE!${NC}"
  echo -e "${YELLOW}   Recomendação: Rotacionar secrets comprometidas e adicionar ao .gitignore${NC}"
  
  # Registrar incidente
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  echo "{\"timestamp\":\"$TIMESTAMP\",\"type\":\"scan\",\"findings\":$FOUND,\"status\":\"open\"}" >> "$INCIDENTS_FILE"
fi

exit $FOUND
