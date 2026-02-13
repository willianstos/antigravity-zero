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
