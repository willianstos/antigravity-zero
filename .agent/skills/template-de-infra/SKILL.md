---
name: template-de-infra
description: Habilidade de geração de infraestrutura de elite (Terraform, LocalStack, K3s, MinIO) seguindo padrões 2026.
---

# Habilidade: Template de Infraestrutura Elite (10/02/2026)

## Objetivo
Fornecer moldes (boilerplates) de infraestrutura "mão na massa" para o Open Claw Bot, garantindo que o ambiente local seja uma cópia fiel da nuvem.

## O Padrão de Elite (Stack Home Lab 2026)
1.  **Orquestração IaC**: Terraform com estrutura de `modules/` e `environments/`.
2.  **Remote State**: Backend S3 apontando para o seu **MinIO** local (`terraform-state` bucket).
3.  **AWS Emulation**: LocalStack para serviços específicos (SQS, Lambda).
4.  **Cluster K8s**: K3s multi-node (Master/Worker) provisionado via IaC.

## Como Usar este Template
Solicite o "Template Home Lab" para gerar:
- `terraform/main.tf`: Lógica principal do cluster.
- `terraform/terraform.tf`: Configuração de Providers e Backend S3 (MinIO).
- `terraform/variables.tf`: Parametrização completa (Master/Worker IPs).
- `terraform/terraform.tfvars`: Valores sensíveis (NÃO commitar).

## Exemplo de Configuração (Terraform + LocalStack)
```hcl
provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = "us-east-1"
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    s3  = "http://localhost:4566" # LocalStack
    sqs = "http://localhost:4566"
  }
}
```

---
*Assinado: Arquiteto de Sistemas Antigravity 2026*
