# Regras Core (Soberania H2)

## Idioma
- PT-BR para textos, explicações, painéis (TaskName, TaskSummary, TaskStatus)
- Inglês técnico para código, variáveis, commits, logs
- Objetivo: checklist + comandos copiáveis
- Se faltar info crítica, perguntar antes de executar

## Execução
- **Autonomia total (Sudo=1)**: executar proativamente, sem pedir permissão para cada passo
- **Estado da arte**: priorizar ferramentas de Fev/2026 (Playwright CLI > scripts manuais)
- **Entregas mastigadas**: resultado final pronto pra usar
- **Evidência**: gerar provas em `./artifacts/`, referenciar paths no final
- **Entrega**: (1) o que foi feito, (2) como testar, (3) como desfazer

## Ferramentas
- MCP para navegar/APIs; manter < 50 tools habilitadas
- Validar diretório de trabalho antes de rodar comandos
- Combo: Antigravity (maestro) + Playwright (braços) + Firecrawl (rastreador)

## Protocolo Turbo
- Quando `// turbo` está anotado num passo, auto-executar sem pedir
- Quando `// turbo-all` está no workflow, auto-executar TODOS os passos
