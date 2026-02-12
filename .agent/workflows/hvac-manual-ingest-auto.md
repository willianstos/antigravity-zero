---
description: Workflow Full-Auto para Ingestão e Inteligência de Manuais HVAC (Docling + AI)
---

# Workflow: HVAC Manual Ingest (Soberano) // turbo-all

Este workflow automatiza a transformação de um PDF bruto de ar condicionado em uma base de conhecimento inteligente com 200 Q&A.

## Protocolo de Execução Full-Auto

// turbo
1. **Preparação do Ambiente**
   Garante que o Docling e as chaves de API estão prontas.
   `pip install docling openai python-dotenv`

2. **Ingestão e Conversão (Docling)**
   Converte o PDF para Markdown preservando tabelas técnica.
   `docling convert {pdf_path} --output ./data/markdown/`

3. **Enriquecimento com IA (Top 200 Q&A)**
   O Jarvis processa o MD e gera a lista de falhas futuras e diagnósticos.
   `python3 bin/hvac-intel.py ./data/markdown/{pdf_name}.md`

4. **Indexação na Memória de Longo Prazo**
   Sincroniza o novo conhecimento com o Qdrant local.
   `curl -X POST http://localhost:6333/collections/domain-hvac/points`

5. **Sincronização de Código**
   Versiona a nova base de conhecimento no GitHub via GitOps Sync.
   `//git-ops-sync "feat(hvac): new intelligence for {pdf_name}"`

---
*Assinado: Jarvis Sovereign - Mestre da Tecnologia Inverter*
