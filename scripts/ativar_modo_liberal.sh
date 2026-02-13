#!/bin/bash
# Script de Ativação do Poder Total - Antigravity 2026
echo "Ativando Modo Liberal para o Open Claw Bot..."

# 1. Garantir que os logs de sistema existam e sejam graváveis
sudo touch /var/log/claw-bot.log /var/log/claw-bot-error.log
sudo chmod 666 /var/log/claw-bot.log /var/log/claw-bot-error.log

# 2. Copiar serviço para o systemd
echo "Instalando serviço systemd..."
sudo cp infra/scripts/open-claw-bot.service /etc/systemd/system/

# 3. Reload do daemon
sudo systemctl daemon-reload
echo "Ambiente Liberal preparado. Aguardando ferramentas (Terraform/Firecrawl) para o start final."
