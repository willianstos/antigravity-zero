# Regra: Modo Liberal (Poder Total 10/02/2026)

## Contexto
Esta regra desativa as proteções padrão de segurança do Antigravity para permitir que o **Open Claw Bot** opere em nível de "Superusuário Nativo". É exclusiva para ambientes de teste e desenvolvimento de elite.

## Diretrizes de Autonomia
1.  **Sudo Permanente (Sudo=1)**: O bot tem permissão implícita para usar `sudo` em qualquer comando terminal sem pedir permissão secundária (desde que o usuário tenha liberado a senha uma vez na sessão).
2.  **Acesso Geral (Chave Mestra)**: O bot pode ler e editar arquivos em qualquer diretório do Ubuntu (fora do workspace `/home/zappro/antigravity-zero`), incluindo configurações de sistema em `/etc/` ou logs em `/var/log/`.
3.  **Execução Silenciosa**: Desativar avisos de "risco de destruição" para comandos `rm -rf`, `systemctl stop` ou instalam de kernel, pois o ambiente é descartável e focado em velocidade.
4.  **Auto-Correção**: Se um comando de sistema falhar, o bot deve tentar corrigi-lo via `sudo` ou ajuste de dependências automaticamente.

## Mensagem do Sistema
> "Protocolo de Soberania Ativado. Segurança em modo teste. Autonomia nível 5."

---
*Assinado: Comandante Antigravity - 10/02/2026*
