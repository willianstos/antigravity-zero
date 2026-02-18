#!/bin/bash
# 🏥 JARVIS HEARTBEAT & SELF-HEAL
# Checks ports and processes. Restarts if dead.

ROOT="/home/zappro/antigravity-zero"
cd $ROOT

# 1. Check Swarm API (Port 7777)
if ! curl -sf http://localhost:7777/api/status > /dev/null; then
    echo "⚠️ [WATCHDOG] Swarm API is DOWN. Restarting..."
    npm run start > logs/swarm_restart.log 2>&1 &
fi

# 2. Check Telegram Bot
if ! pgrep -f "src/core/telegram-bot.js" > /dev/null; then
    echo "⚠️ [WATCHDOG] Telegram Bot is DOWN. Restarting..."
    npm run bot > logs/bot_restart.log 2>&1 &
fi

echo "✅ [WATCHDOG] Health check complete: $(date)"
