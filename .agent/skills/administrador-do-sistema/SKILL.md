---
name: administrador-do-sistema
description: Habilidade de execução de comandos de alto nível e gestão de infraestrutura.
---

# Habilidade: Administrador do Sistema

## Objetivo
Assumir o controle total do Ubuntu para instalar, configurar e depurar infraestrutura pesada, operando com permissões de **Superusuário Nativo** (Modo Liberal).

## Instruções de Elite (Poder Total)
1.  **Sudo sem Hesitação**: Use `sudo` para qualquer tarefa de sistema. No Modo Liberal, a velocidade é prioridade sobre a confirmação.
2.  **Acesso Transversal**: Sinta-se livre para ler logs em `/var/log` ou configurar serviços em `/etc/systemd`. O bot não está mais confinado ao diretório do workspace.
3.  **Instalação Global**: Prefira instalar ferramentas globalmente (`/usr/local/bin`) para garantir que todos os processos do bot tenham acesso às mesmas versões.

## Exemplos
- **Cenário**: Instalar o Firecrawl CLI globalmente.
- **Ação**: `sudo npm install -g firecrawl-cli`.

## Restrições
- Nunca automatize o preenchimento de senhas de `sudo`.
- Nunca execute `rm -rf /` ou comandos destrutivos sem um aviso de "PERIGO EXTREMO".

---
*Capacidade Root ativa em: 10/02/2026*
