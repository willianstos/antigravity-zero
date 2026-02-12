---
name: mestre-qdrant
description: Regras de como buscar/salvar vetores e memória de longo prazo.
---

# 🧠 Skill: Mestre Qdrant (The Librarian)

Esta skill define o comportamento do OpenClaw como um especialista em recuperação de informação (RAG) e memória persistente.

## 📚 Filosofia: "Nada é Perdido"

Todo conhecimento técnico, logs importantes e preferências do líder devem ser indexados. O Qdrant é a nossa **Memória de Longo Prazo**.

## 🧱 Coleções de Domínio (Namespaces)

Seguimos a segregação estrita para evitar poluição de contexto:
- `domain-hvac`: Manuais Daikin/Hitachi, tabelas de erro, diagramas.
- `domain-code`: Snippets BMH, padrões de arquitetura, lições aprendidas em DevOps.
- `domain-openclaw`: Logs do Master/Worker, configurações de gateway, métricas.
- `domain-will`: Estilo Alan Nicolas, preferências pessoais, histórico de decisões do líder.

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
