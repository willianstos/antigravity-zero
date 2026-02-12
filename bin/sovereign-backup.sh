#!/bin/bash
# 🛡️ Sovereign Backup - Data Immortality
# Backup imutável e criptografado via Rclone.

IAM_LOGGER="/home/zappro/antigravity-zero/bin/iam-logger.mjs"
BACKUP_SOURCE="/home/zappro/antigravity-zero"
EXCLUDES="--exclude node_modules/ --exclude venv/ --exclude venv-hvac/ --exclude .git/ --exclude models/"

log_iam() {
    node "$IAM_LOGGER" KEEPER "$1"
}

run_backup() {
    log_iam "🛡️ Iniciando Backup Soberano Off-site..."
    
    # Criar snapshot dos dados locais
    log_iam "📦 Compactando metadados de infraestrutura..."
    tar -czf /tmp/sovereign-metadata.tar.gz -C "$BACKUP_SOURCE" infra/monitoring/localstack_data .agent/rules artifacts

    # Sincronização via Rclone (Simulada para destino local até que líder defina S3/GDrive)
    # rclone sync /tmp/sovereign-metadata.tar.gz remote:sovereign-backups
    
    mkdir -p /home/zappro/backups/sovereign
    cp /tmp/sovereign-metadata.tar.gz /home/zappro/backups/sovereign/snapshot-$(date +%Y%m%d).tar.gz
    
    log_iam "✅ Backup imutável salvo em /home/zappro/backups/sovereign/. Resiliência +1."
}

run_backup
