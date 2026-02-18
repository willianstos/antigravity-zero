# Regra: Protocolo Turbo (Otimização de Performance 2026)

## Contexto
O ecossistema **Open Claw** prioriza a velocidade de execução. Lag no Chromium ou no Antigravity compromete a soberania do Jarvis.

## Diretrizes de Desempenho
1. **Chromium Hardening (Low Latency)**:
   - Sempre rodar Playwright com flags de desativação de GPU e aceleração de vídeo se estiver em ambiente sem monitor real.
   - Forçar `--disable-dev-shm-usage` e `--no-sandbox` (já que temos o Modo Liberal) para evitar gargalos de I/O de memória.
2. **Prioridade de Processo (Nice/Ionice)**:
   - Scripts críticos de orquestração devem rodar com prioridade de CPU elevada.
3. **Limpeza de Cache**:
   - Manter Redis limpo e realizar purgas de logs de artefatos antigos semanalmente via Skill `zelador-do-codigo`.
4. **Hardware Acceleration**:
   - Se houver GPU disponível, garantir o passthrough correto para o Chromium.

---
*Assinado: Arquiteto de Performance Jarvis - 10/02/2026*
