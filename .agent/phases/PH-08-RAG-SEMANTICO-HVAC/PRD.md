# PRD: RAG Semântico HVAC (Super Phase)

//full-auto
//auto-pilot
//sudo-level:1
//performance-mode:turbo

> **Fase:** PH-08-RAG-SEMANTICO-HVAC
> **Status:** Execução (Full-Auto)
> **Goal:** Construir o RAG definitivo para manuais técnicos de Ar Condicionado Inverter e Inversores de Frequência.

## 🎯 Objetivo
Implementar um sistema de RAG (Busca e Geração Aumentada) altamente especializado, capaz de diferenciar manuais técnicos de materiais de marketing, classificar por marca/modelo/série e fornecer respostas técnicas precisas para engenheiros e técnicos de campo. Zero alucinação, zero conteúdo inútil.

## 🏗️ Arquitetura Técnica
- **Ingestão:** Pipeline `PDF → Docling (MD) → Classificador → Metadados → Qdrant`.
- **Classificação:** Análise semântica por conteúdo (Whitelist/Blacklist) via `hvac-classifier.mjs`.
- **Banco Vetorial:** Qdrant (Docker local) com collections isoladas (Namespaces).
- **Orquestração:** OpenClaw Bot via skills especializadas e Subagentes.
- **Frontend:** Interface Telegram interativa.

## 🧱 Segregação de Domínios (Subagentes & Namespaces)
Para evitar que o bot misture assuntos ("salada"), cada tópico vive em um **Namespace Isolado** no Qdrant e é gerenciado por uma Skill específica.

| Domínio | Subagente (Role) | Collection Qdrant | Conteúdo Permitido | Skill |
| :--- | :--- | :--- | :--- | :--- |
| **HVAC Inverter** | `Tech Specialist` | `domain-hvac` | Manuais técnicos, erros, diagramas, fatos técnicos. | `hvac-rag` |
| **OpenClaw (Meta)** | `Bot Kernel` | `domain-openclaw` | Logs, configs do bot, status de tarefas. | `taskmaster` |
| **Code & Dev** | `Software Engineer` | `domain-code` | Scripts, docs de arquitetura, snippets. | `zelador-codigo` |
| **Will-Dev (Líder)** | `Personal Assistant` | `domain-will` | Preferências, família, estilo de vida, projetos pessoais. | `memoria-pessoal` |

### Regra de Ouro (Pinada):
**NUNCA misturar contextos.**
- Uma pergunta sobre "Erro E4" SÓ consulta `domain-hvac`.
- Uma pergunta sobre "Aniversário da esposa" SÓ consulta `domain-will`.
- O Roteador (Router) inicial decide qual subagente ativar.


## 👥 Times & Skills (Agentes)
- **Research Specialist (Líder da Fase):** Responsável pela curadoria e validação técnica.
- **Node.js Engineer:** Implementação dos scripts de backend.
- **Security Guardian:** Garantir que o parser não execute código malicioso dos PDFs.
- **Qdrant Operator:** Gestão do banco vetorial.

## ✅ Lista de Tarefas (Execution Plan)

### 1. Infraestrutura & Setup
- [ ] Criar estrutura de diretórios `backend/rag/` e `data/`
- [ ] Instalar dependências (`docling`, `@qdrant/js-client-rest`, `langchain`, etc)
- [ ] Subir container Qdrant e criar collections

### 2. Core do Classificador (The "Brain")
- [ ] Implementar `backend/rag/brands/brands.json` (Catálogo Mestre)
- [ ] Implementar `backend/rag/hvac-classifier.mjs` (Lógica Whitelist/Blacklist)
- [ ] Testar classificador com PDFs de exemplo (técnico vs marketing)

### 3. Pipeline de Ingestão (The "Engine")
- [ ] Implementar `backend/rag/hvac-metadata.mjs` (Extração de Specs)
- [ ] Implementar `backend/rag/hvac-ingest.mjs` (Orquestrador de Ingestão)
- [ ] Criar skill do OpenClaw `classificador-hvac`

### 4. Busca e Recuperação (The "Interface")
- [ ] Implementar `backend/rag/hvac-search.mjs`
- [ ] Criar regras de busca (re-ranking, threshold de similaridade)

### 5. Validação Final (The "Exam")
- [ ] Ingerir lote de testes (5 manuais Inverter, 2 Convencionais, 3 Marketing)
- [ ] Verificar se Blacklist funcionou (100% rejeição de marketing)
- [ ] Verificar se Whitelist funcionou (100% aprovação de técnicos)
- [ ] Realizar perguntas técnicas via Telegram e validar precisão

## 📦 Entregáveis
1. Sistema RAG funcionando localmente.
2. Bot do Telegram respondendo dúvidas técnicas de manuais.
3. Relatório de precisão da classificação.
