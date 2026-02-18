# Regra: Observabilidade Antifraude (Audit Trail)

## Contexto
Cada decisão do Jarvis deve ser rastreável. No modo //full-auto, a auditoria é a única defesa contra ações imprevistas.

## Diretrizes de Log
1. **Log Imutável**: Os logs de execução em `.agent/phases/PH-*/logs/` devem ser preservados e nunca editados pelo bot.
2. **Assinatura de Decisão**: Cada ação crítica (ex: `terraform apply`) deve registrar o "Raciocínio" (Chain of Thought) que levou àquela decisão.
3. **Alertas de Anomalia**: Se o bot executar mais de 5 comandos de sistema em 1 minuto sem justificativa no PRD, o sistema deve entrar em "Safe Mode".
4. **Snapshots de Estado**: Realizar backups diários do arquivo `.env` (criptografado) e das configurações de rede.

---
*Assinado: Auditor Jarvis - 10/02/2026*
