---
name: motor-rag-qdrant
description: Pipeline RAG completo com Qdrant local para busca semântica em documentos do workspace.
---

# 🧠 Motor RAG com Qdrant

> Busca semântica nos documentos do workspace. PDF → chunks → embeddings → Qdrant → resposta contextual.

## Stack
- **Vector DB:** Qdrant (Docker local, porta 6333)
- **Embeddings:** FastEmbed (sentence-transformers/all-MiniLM-L6-v2)
- **Chunking:** RecursiveCharacterTextSplitter (500 tokens, overlap 50)
- **LLM:** OpenRouter (modelo configurado no .env)

## Setup (1 vez)

### 1. Subir Qdrant
```bash
docker run -d --name qdrant \
  -p 6333:6333 -p 6334:6334 \
  -v /home/zappro/antigravity-zero/data/qdrant:/qdrant/storage \
  qdrant/qdrant:latest
```

### 2. Instalar dependências
```bash
cd /home/zappro/antigravity-zero/backend
npm install @qdrant/js-client-rest
```

### 3. Verificar
```bash
curl -s http://localhost:6333/healthz
# → {"title":"qdrant - vectorass engine","version":"..."}
```

## Pipeline RAG

### Ingestão (indexar documentos)
```
1. Ler arquivos (.md, .pdf, .txt) do workspace
2. Chunkar em blocos de ~500 tokens com overlap de 50
3. Gerar embeddings com FastEmbed (384 dimensões)
4. Upsert no Qdrant (collection: "antigravity-docs")
```

### Consulta (buscar contexto)
```
1. Receber pergunta do usuário
2. Gerar embedding da pergunta
3. Buscar top-5 chunks mais similares no Qdrant
4. Enviar chunks como contexto + pergunta para LLM
5. Retornar resposta contextualizada
```

## Collections Sugeridas

| Collection | Conteúdo | Uso |
|---|---|---|
| `antigravity-docs` | Docs, rules, skills do workspace | Contexto geral |
| `pdf-extractions` | PDFs extraídos pelo Docling | Knowledge base |
| `chat-history` | Histórico de conversas relevantes | Memória de longo prazo |

## Integração com OpenClaw

O motor RAG funciona como **skill** do bot. Quando o bot recebe uma pergunta:
1. Primeiro busca no Qdrant por contexto relevante
2. Se encontrar (score > 0.7), inclui no prompt
3. Se não encontrar, responde com conhecimento geral

## Comandos para o Bot (Telegram)

```
/rag index           → Reindexar todos os docs
/rag search <query>  → Buscar documentos relevantes
/rag status          → Status da collection
/rag clear           → Limpar collection
```

## Segurança
- Qdrant bind em `127.0.0.1` (nunca expor externamente)
- API key configurável no Qdrant para acesso autenticado
- Dados persistidos em `data/qdrant/` (incluir no backup)
