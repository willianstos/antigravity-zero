---
description: Reiniciar Jarvis (Bot + Swarm) de forma segura sem matar o IDE
---

Este workflow reinicia os serviços do Jarvis (Telegram Bot e Swarm Server) matando apenas os processos específicos, garantindo que o VS Code e o terminal permaneçam ativos.
Útil para resolver erros de "Conflict: terminated by other getUpdates request".

# Passos

1. Dar permissão de execução ao script de restart seguro
// turbo
chmod +x scripts/safe-restart.sh

2. Executar o script de restart
// turbo
./scripts/safe-restart.sh

3. Verificar logs em tempo real
// turbo
tail -f logs/bot.log logs/swarm.log
