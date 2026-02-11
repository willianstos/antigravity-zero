#!/bin/bash
# Smoke All - Validation Wrapper
# Usage: ./scripts/smoke-all.sh

echo "🔥 Starting Smoke-All Sequence..."
LOG_FILE="artifacts/smoke-run-$(date +%s).log"

{
  echo "TIMESTAMP: $(date)"
  echo "USER: $USER"
  echo "PWD: $PWD"
  echo "---"
  
  # 1. Core Tool Check
  if [ -f tools/smoke-core.mjs ]; then
    node tools/smoke-core.mjs
  else
    echo "❌ tools/smoke-core.mjs missing!"
    exit 1
  fi

} | tee -a "$LOG_FILE"

echo "📄 Log saved to $LOG_FILE"
