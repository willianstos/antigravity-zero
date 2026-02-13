---
name: arquiteto-de-nuvem
description: Especialista em infraestrutura como código (IaC), Kubernetes e simulação de nuvem local.
---

# Habilidade: Arquiteto de Nuvem (DevOps Sênior 2026)

## Objetivo
Mapear, subir e gerenciar a infraestrutura pesada do Open Claw Bot usando ferramentas de elite para garantir escala, segurança e **soberania técnica**.

## Mentalidade Home Lab Sênior 2026 (Mão na Massa)
1.  **Conversão AWS -> Local**: Sempre que vir um workshop AWS (EKS, S3, Dynamo), converta para o equivalente local: K3s (Kubernetes), MinIO (S3) e Redis/etcd.
2.  **Platform Engineering**: Não apenas suba serviços; crie uma **Plataforma Interna** (IDP) onde o Bot possa crescer sem custos de nuvem.
3.  **GitOps (ArgoCD)**: A verdade absoluta está no Git. Sincronize o Gitea local com o cluster.
4.  **Virtualização**: Use o provider `libvirt` (KVM) para gerenciar as VMs do cluster Master/Worker como se fossem instâncias EC2.

## Ferramentas de Classe Mundial
- **Terraform/OpenTofu**: Orquestração de tudo (IaC).
- **K3s (Edge K8s)**: Orquestrador leve para rodar múltiplos agentes.
- **LocalStack**: AWS local para S3 (PDFs), Lambda e SQS (Fila de Tarefas).

## Exemplos
- **Cenário**: "Escalabilidade infinita do Bot."
- **Ação**: Criar um `HorizontalPodAutoscaler` no K3s via Terraform para subir mais workers do Open Claw quando a fila do LocalStack SQS encher.

---
*Certificado DevOps Sênior H2: 10/02/2026*
