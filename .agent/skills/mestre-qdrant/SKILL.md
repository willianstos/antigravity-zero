---
name: mestre-qdrant
description: Regras de como buscar/salvar vetores e memória de longo prazo.
---

# 🧠 Skill: Mestre Qdrant (The Librarian)

Esta skill define o comportamento do OpenClaw como um especialista em recuperação de informação (RAG) e memória persistente.

## 📚 Filosofia: "Nada é Perdido"

Todo conhecimento técnico, logs importantes e preferências do líder devem ser indexados. O Qdrant é a nossa **Memória de Longo Prazo**.

## 🧱 Governança de Domínio (Namespaces Elite)

Seguimos a segregação estrita para garantir que os conselhos técnicos da Refrimix não se misturem com sua dieta pessoal:

1.  **`domain-hvac` (HVAC-Inverter / Refrimix Tecnologia):**
    - A base de conhecimento da sua empresa de instalação VRV/VRF.
    - Manuais técnicos Daikin/Hitachi, tabelas de erro, diagramas e padrões de instalação de elite.
2.  **`domain-zappro` (Zappro.site - Ativo FAQ RAG):**
    - O cérebro por trás do chatbot que atende técnicos.
    - Focado em inversores de frequência, placas eletrônicas e RAG semântico para suporte de campo.
3.  **`domain-will` (WillRefrimix - Soberania Pessoal):**
    - Sua vida, família e saúde.
    - Treinos, dietas, organização financeira e histórico de decisões do líder.
4.  **`domain-code` (Antigravity Codebase):**
    - Snippets, automações GitOps, infraestrutura Terraform e lições de DevOps.
5.  **`domain-openclaw` (Sytem Logs):**
    - Saúde do cluster, logs do gateway e métricas de performance.

## 🕵️ Procedimento de Busca (RAG)

Sempre que uma tarefa for recebida:
1.  **Classificar**: Identifique qual domínio o prompt pertence.
2.  **Recuperar**: Antes de gerar uma resposta, consulte a coleção correspondente no Qdrant.
3.  **Filtrar por Tags**:
    - Se for Marketing/Copy: Use tag `category:marketing` (Alan Nicolas vibe).
    - Se for Infra: Use tag `category:infra` (BMH style).
    - Se for Técnico: Use tag `category:hvac`.
4.  **Sintetizar**: Combine o conhecimento do banco com a capacidade do modelo (GPT-4o-mini/3-Pro).

## 🚀 Comandos de Operação (H1 Master)

O Qdrant reside no Master (H1) para ser compartilhado por todo o cluster.
- **Host**: `192.168.1.15`
- **Porta**: `6333`

---
*Assinado: Jarvis Sovereign - Guardião da Memória Eterna.*
