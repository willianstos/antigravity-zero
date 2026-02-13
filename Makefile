# 🦞 JARVIS SOVEREIGN - MAKEFILE CONTROL (2026)
# ================================================

.PHONY: up down restart status shell logs audit clean

# Infraestrutura
up:
	cd infra && sudo docker compose up -d

down:
	cd infra && sudo docker compose down

restart:
	cd infra && sudo docker compose restart

status:
	@echo "📡 Verificando Saúde da Stack..."
	@node scripts/bootstrap-stability.mjs

# Operação
bot:
	npm run bot

swarm:
	npm run swarm

mission:
	@read -p "Qual a missão, Líder? " msg; \
	node -e "import { MissionControl } from './src/jarvis/orchestrator/mission-control.mjs'; new MissionControl().run({ mission: '$$msg' })" --input-type=module

# Qualidade e Limpeza
audit:
	@node tests/super-test.mjs

clean:
	@echo "🧹 Limpando processos zumbis..."
	@pkill -f "node src/jarvis" || true
	@pkill -f "node src/core" || true
	@echo "✅ Limpo."

# Atalho Master
all: up status bot
