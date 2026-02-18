# PRD: Phase 04 - Token Economy Engine (Grok 2026) 💰

//full-auto

---

## 1. Diagnóstico do Problema

O Open Claw Bot é um **buraco de tokens** porque:

1. **System prompt gordo**: O `PERSONA.md` + todos os memos do `.context/` são injetados em CADA mensagem. Isso pode ser 3.000–8.000 tokens por chamada.
2. **Sem roteamento de modelo**: Toda pergunta, simples ou complexa, vai para o modelo mais caro (GPT-4o / Grok).
3. **Sem cache semântico**: Perguntas similares repetem a chamada completa à API.
4. **Loop recursivo sem limite real**: O `while (depth < MAX_DEPTH)` pode fazer 3 chamadas completas por mensagem.
5. **Contexto Qdrant não filtrado**: `getFullAwareness()` injeta tudo que encontra, sem threshold de relevância.

**Estimativa de custo atual**: ~15.000 tokens/mensagem complexa × $5/M tokens (Grok) = **$0,075/mensagem**. Em 100 mensagens/dia = **$7,50/dia = $225/mês**.

**Meta pós-otimização**: < $0,005/mensagem = **< $15/mês**.

---

## 2. Arquitetura Token Economy (Padrão 2026)

```
[Mensagem Telegram]
       ↓
[Classifier: simples/médio/complexo] ← modelo local (gratuito)
       ↓
┌──────────────────────────────────────┐
│ SIMPLES → Grok Mini / Flash (barato) │
│ MÉDIO   → Grok 3 / GPT-4o-mini      │
│ COMPLEXO→ Grok 4 / GPT-4o (full)    │
└──────────────────────────────────────┘
       ↓
[Semantic Cache Redis] → HIT? → retorna sem chamar API
       ↓ MISS
[Context Triangulation] → injeta APENAS contexto relevante (RAG Qdrant)
       ↓
[LLM Call] → resposta
       ↓
[Cache Store Redis TTL=1h]
```

---

## 3. Roles & Skills
- `mestre-qdrant`: RAG com threshold de relevância.
- `guardiao-de-secrets`: Redis como cache semântico.
- `zelador-do-codigo`: Refatorar `openclaw-bridge.mjs` e `context-manager.mjs`.

---

## 4. Fila de Tasks

- [ ] **T01**: Criar `src/jarvis/ai/token-router.mjs` — roteador de modelo por complexidade.
- [ ] **T02**: Criar `src/jarvis/ai/semantic-cache.mjs` — cache Redis para respostas similares.
- [ ] **T03**: Refatorar `getFullAwareness()` no bridge — aplicar threshold de relevância no Qdrant.
- [ ] **T04**: Comprimir `PERSONA.md` — reduzir de ~1.800 chars para < 400 chars (essência apenas).
- [ ] **T05**: Integrar token-router no `telegram-bot.js` — substituir chamada direta ao OpenAI.
- [ ] **T06**: Adicionar contador de tokens no log — monitorar gasto real por mensagem.

---

## 5. Estimativa de Economia

| Técnica | Economia Estimada |
|---|---|
| Model Routing (simples→mini) | 50-70% |
| Semantic Cache (Redis) | 30-40% nas repetições |
| Context Triangulation (RAG threshold) | 40-60% nos tokens de entrada |
| PERSONA.md comprimida | 15-25% |
| **Total combinado** | **~80-90%** |
