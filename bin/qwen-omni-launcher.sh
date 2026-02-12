#!/bin/bash
# 🦅 Qwen Omni Launcher (Node H2) - Conservative v4
# Otimizado para RTX 3060 (12GB)

MODEL_PATH="/home/zappro/antigravity-zero/models/Qwen2.5-Omni-7B"
PORT=8000
LOG_FILE="/home/zappro/antigravity-zero/artifacts/qwen-omni.log"

# Limpar processos antigos
pkill -f "vllm.entrypoints.openai.api_server" || true
sleep 3

echo "🦅 Iniciando Qwen2.5-Omni-7B na Porta $PORT (Super Conservative)..."
echo "[$(date)] Launching vLLM (Super Conservative)..." > $LOG_FILE

export VLLM_USE_V1=0
export CUDA_VISIBLE_DEVICES=0

./venv/bin/python3 -m vllm.entrypoints.openai.api_server \
    --model $MODEL_PATH \
    --gpu-memory-utilization 0.70 \
    --max-model-len 1024 \
    --port $PORT \
    --host 0.0.0.0 \
    --trust-remote-code \
    --enforce-eager \
    >> $LOG_FILE 2>&1 &

PID=$!
echo $PID > qwen-omni.pid
echo "✅ vLLM iniciado no PID $PID. Verifique logs em $LOG_FILE"
