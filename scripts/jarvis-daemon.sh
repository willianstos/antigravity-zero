#!/bin/bash
# 🤖 JARVIS DAEMON 2026 (FINAL)
# //full-auto //sudo=1

ROOT="/home/zappro/antigravity-zero"
cd "$ROOT"

# 🧼 Cleanup Chrome Locks
echo "🧹 Cleaning Chrome SingletonLocks..."
rm -f /home/zappro/.config/google-chrome/SingletonLock 2>/dev/null
rm -f /home/zappro/.config/google-chrome/Default/SingletonLock 2>/dev/null
rm -f /home/zappro/.config/google-chrome/Profile\ 1/SingletonLock 2>/dev/null

echo "🐝 [SWARM] Starting..."
/usr/bin/node src/jarvis/swarm-server.mjs >> logs/swarm.log 2>&1 &
SWARM_PID=$!

sleep 5

echo "🦞 [BOT] Starting..."
/usr/bin/node src/core/telegram-bot.js >> logs/bot.log 2>&1 &
BOT_PID=$!

echo "🚀 [DAEMON] Online. PIDs: $SWARM_PID, $BOT_PID"
wait $SWARM_PID $BOT_PID
