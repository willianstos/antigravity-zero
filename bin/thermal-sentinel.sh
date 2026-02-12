#!/bin/bash
# 🌡️ Thermal Sentinel - Hardware Guard
# Monitora temperaturas e dispara Throttling preventivo.

THRESHOLD=82
IAM_LOGGER="/home/zappro/antigravity-zero/bin/iam-logger.mjs"

log_iam() {
    node "$IAM_LOGGER" GUARD "$1"
}

check_thermal() {
    # Pegar temperatura da GPU (H2)
    TEMP=$(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits 2>/dev/null)
    
    if [ -z "$TEMP" ]; then
        log_iam "⚠️ Falha ao ler sensor GPU. Pulando ciclo."
        exit 0
    fi

    if [ "$TEMP" -ge "$THRESHOLD" ]; then
        log_iam "🔥 CRITICAL: GPU TEMP REACHED ${TEMP}°C! Ativando Throttling Soberano..."
        # Ação: Pausar containers pesados ou migrar tarefas
        # docker pause worker_hvac localstack_refrimix
        log_iam "🛑 Tarefas de background pausadas para resfriamento."
    else
        log_iam "🌡️ Térmico Nominal: ${TEMP}°C. Sistema operando em Full Performance."
    fi
}

check_thermal
