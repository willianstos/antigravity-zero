# Padrão de Infraestrutura (Nuvem Local)

Este documento define como gerenciamos os recursos de sistema e nuvem simulada.

## Diretrizes de Recursos
1.  **Isolamento**: Todo bot " Open Claw" em produção deve rodar dentro de um namespace específico no **K3s**.
2.  **Economia**: O **LocalStack** deve ser desligado (`localstack stop`) se não houver tarefas de extração pendentes para poupar bateria e RAM.
3.  **Persistência**: Dados importantes do S3 (PDFs brutos) devem ser mapeados para volumes locais no Ubuntu, garantindo que não se percam no reset do container.

## Nomenclatura e Convenções IaC
- **tfvars**: Arquivos `terraform.tfvars` NUNCA devem ser commitados no Git. Use segredos do Gitea/GitHub.
- **Backend**: Todo estado deve residir no **MinIO** local para permitir o trabalho em equipe (ou multicanal do Bot).
- **Virtualização**: Priorize o uso de VMs (KVM) para simular o Master/Worker, garantindo um ambiente idêntico ao EKS.

---
*Normas validadas em: 10/02/2026*
