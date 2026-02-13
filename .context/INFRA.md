# 🏗️ Infraestrutura Soberana

## Stack de Containers (Docker)
Localizada em `./infra/docker-compose.yml`.

| Serviço | Função | Porta |
| :--- | :--- | :--- |
| **LocalStack** | Emulação de Nuvem AWS (S3, SQS, IAM) | 4566 |
| **MinIO** | Armazenamento de Objetos (S3) | 9005 (API), 9001 (Consol) |
| **Qdrant** | Banco de Vetores (Memória Semântica) | 6333 |
| **Grafana** | Visualização de Métricas | 3000 |

## Gestão de Infraestrutura (Terraform)
Localizada em `./infra/terraform/`.
- **Backend**: Armazenado de forma segura no MinIO (bucket `terraform-state`).
- **Segurança**: Credenciais carregadas via `scripts/tf-apply.sh` a partir do `.env`.

## Redes
- **sovereign-network**: Rede interna isolada para comunicação entre serviços.
- **Jarvis Swarm**: Porta `7777` (Dashboard e API).
