#!/bin/bash
# FILE: scripts/optimize-system.sh

# Increase file descriptors
echo "🚀 Optimizing file descriptors..."
sudo sysctl -w fs.file-max=500000
grep -q "fs.file-max=500000" /etc/sysctl.conf || echo "fs.file-max=500000" | sudo tee -a /etc/sysctl.conf

# CPU governor to performance
echo "🚀 Setting CPU governor to performance..."
if [ -d /sys/devices/system/cpu/cpu0/cpufreq ]; then
    echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
else
    echo "⚠️ CPU scaling governor directory not found, skipping."
fi

# Cache cleanup cron
echo "🚀 Setting up cache cleanup cron..."
(crontab -l 2>/dev/null | grep -v "drop_caches"; echo "0 */2 * * * sync; echo 3 > /proc/sys/vm/drop_caches") | crontab -

echo "✅ System optimized for Chromium headless"
