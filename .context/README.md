# Jarvis Sovereign — Memos Unificados
# Estes documentos são a ÚNICA fonte de verdade.
# O OpenClaw Bot lê esta pasta como contexto.
# Devs leem esta pasta como documentação.
# Não duplicar info — tudo aqui.

## Arquivos neste diretório

| Arquivo | Serve para |
|---------|-----------|
| `SYSTEM.md` | Identidade, hardware, arquitetura, endpoints |
| `AGENTS.md` | Descrição de cada agent do swarm |
| `INFRA.md` | Docker, Terraform, MinIO, LocalStack |
| `RULES.md` | Regras de execução e segurança |
| `ROADMAP.md` | Próximos 100 dias de features |

## Como o OpenClaw usa isso
O bot carrega `SYSTEM.md` + `AGENTS.md` como system prompt.
Quando recebe uma task, consulta `INFRA.md` para endpoints.
Quando precisa decidir, consulta `RULES.md` para limites.

## Para devs
Estes são os mesmos docs. Sem duplicação. Sem conflito.
