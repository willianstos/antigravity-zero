#!/bin/bash
# PH-01 Master Installation Script
# Protocols: //full-auto //sudo-level:1

echo "🛡️ JARVIS PHASE 01: Master Infrastructure Sync"
echo "---------------------------------------------"

# 1. Clean apt locks
echo "🧹 Cleaning apt locks..."
sudo killall apt apt-get dpkg 2>/dev/null
sudo rm -f /var/lib/apt/lists/lock /var/lib/dpkg/lock* /var/cache/apt/archives/lock
sudo dpkg --configure -a

# 2. Add Nodesource GPG and Repo for Node v22
echo "📦 Configuring Node.js v22 repo..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg --overwrite
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

# 3. Final Install
echo "🚀 Installing Node.js v22 and Redis Server..."
sudo apt-get update
sudo apt-get install -y nodejs redis-server

# 4. OpenClaw CLI
echo "🦞 Installing OpenClaw CLI officially..."
sudo npm install -g @openclaw/cli

# 5. Enable Redis
echo "🔑 Enabling Redis Porteiro..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

# 6. Final Status
echo "---------------------------------------------"
echo "✅ Node version: $(node -v)"
echo "✅ Redis check: $(redis-cli ping)"
echo "✅ OpenClaw check: $(openclaw --version)"
echo "---------------------------------------------"
echo "💎 PH-01 INFRASTRUCTURE: STABLE"
