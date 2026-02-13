#!/bin/bash
# FILE: scripts/install_chrome.sh

echo "🚀 Starting Google Chrome Migration..."

# 1. Purge Chromium
echo "🧹 Purging Chromium artifacts..."
sudo apt remove --purge -y chromium-browser chromium-browser-l10n chromium-codecs-ffmpeg-extra
sudo rm -rf ~/.cache/chromium
sudo rm -rf ~/.config/chromium
sudo rm -rf /etc/chromium-browser

# 2. Download & Install Chrome Stable
echo "📥 Downloading Google Chrome Stable..."
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O /tmp/google-chrome-stable.deb

echo "📦 Installing Google Chrome..."
sudo apt install -y /tmp/google-chrome-stable.deb
rm /tmp/google-chrome-stable.deb

# 3. Verify Installation
echo "✅ Installation complete. Verifying version..."
google-chrome --version

# 4. Reconfigure Playwright Browsers
echo "🎭 Configuring Playwright..."
npx playwright install chrome
