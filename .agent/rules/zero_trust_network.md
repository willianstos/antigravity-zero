# Regra: Protocolo Zero Trust Network (Network Hardening)

## Contexto
O **Open Claw Bot** interage com APIs externas (Telegram, Antigravity, Firecrawl). Para evitar vazamento de dados ou C&C (Command & Control), a rede deve ser "bloqueada por padrão".

## Diretrizes de Rede
1. **Egress Whitelisting**: O Jarvis só tem permissão para se comunicar com domínios autorizados:
   - `*.google.com` (Antigravity/Gemini)
   - `api.telegram.org` (Telegram)
   - `*.firecrawl.dev` (Scraping)
   - `*.nodesource.com` (Updates)
2. **UFW Stealth**: O firewall `ufw` deve estar ativo, bloqueando todas as conexões de entrada (Incoming) e permitindo apenas portas específicas para Kubernetes/LocalStack.
3. **DNS Seguro**: Utilizar DNS over HTTPS (DoH) para evitar interceptação de requisições de orquestração.
4. **Monitoramento de Tráfego**: Qualquer tentativa de conexão para IPs não catalogados deve ser logada e notificada ao usuário via canal de alerta.

---
*Assinado: Engenheiro de Redes Jarvis - 10/02/2026*
