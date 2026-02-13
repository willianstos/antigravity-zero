# PRD [PH-02]: PERFORMANCE-OPTIMIZATION (CHROMIUM & ANTIGRAVITY)
//full-auto
//sudo-level:1
//performance-mode:turbo

## 💎 EXEC SUMMARY
Esta fase foca na otimização extrema do stack de navegação (Chromium Headless) para reduzir o consumo de recursos (RAM/CPU) em 60% e eliminar instabilidades no ambiente Ubuntu 24.04 (Ryzen 5600X).

## 🏗️ TECH ARCHITECTURE
- **Engine**: Playwright (Chromium Headless)
- **Optimization Strategy**: Resource blocking, single-process execution, and system-level tuning.
- **Orchestration**: Docker Compose & Systemd.

## 🎭 ROLES & PERMISSIONS
- **Role**: `PERFORMANCE_ARCHITECT`
- **User**: `zappro` (Sudo=1)

## ✅ TASK QUEUE
- [x] Criar `playwright.config.js` com flags de performance.
- [x] Implementar `tools/antigravity-optimized.js` com auto-restart.
- [x] Configurar `infra/docker-compose.yml` com limites de recursos.
- [x] Criar e executar `scripts/optimize-system.sh` para tuning do kernel.
- [x] Implementar `tools/navigation-helper.js` para carregamento leve.
- [x] Executar bateria de validação (Target: <3000ms load).

---
*Assinado: Jarvis Orquestrador em 11/02/2026*
