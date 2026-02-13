#!/bin/bash
# 🦅 Qwen Omni Launcher (Node H2) - Super Stable Ignitor v6
MODEL_PATH="/home/zappro/antigravity-zero/models/Qwen2.5-Omni-7B"
PORT=8000
LOG_FILE="/home/zappro/antigravity-zero/artifacts/qwen-omni.log"
pkill -9 -f "vllm.entrypoints.openai.api_server" || true
export VLLM_USE_V1=0
./venv/bin/python3 -m vllm.entrypoints.openai.api_server --model $MODEL_PATH --gpu-memory-utilization 0.60 --max-model-len 4096 --dtype float16 --enforce-eager --port $PORT --host 0.0.0.0 --trust-remote-code >> $LOG_FILE 2>&1 &
echo "✅ vLLM iniciado."
