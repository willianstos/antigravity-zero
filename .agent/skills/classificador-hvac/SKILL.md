---
name: classificador-hvac
description: Skill para classificar, indexar e buscar informações técnicas em manuais HVAC Inverter via RAG.
---

# 🏭 Classificador HVAC & RAG

> Ensina o bot a operar o pipeline RAG HVAC completo: Ingestão, Classificação, Metadados e Busca.

## Comandos

### 1. Ingestão (Indexação)
```
/hvac ingest <url>   → Baixar e processar PDF
/hvac reindex        → Reindexar pasta data/pdfs/inbox
```
O bot executa: `node backend/rag/hvac-ingest.mjs <arquivo>`

### 2. Busca Técnica
```
/hvac search <pergunta> [marca] [modelo]
Ex: /hvac search "código E1" Midea 38VFCA
```
O bot executa: `node backend/rag/hvac-search.mjs "<pergunta>" [marca] [modelo]`

### 3. Status
```
/hvac status         → Resumo collections e arquivos
```
O bot informa: Total indexados (whitelist), Total rejeitados (blacklist).

## Regras de Resposta
1. Sempre citar a **fonte** (manual e página).
2. Se a busca retornar score < 0.7, avisar: "⚠️ Confiança baixa. Verifique o manual original."
3. Priorizar **trechos exatos** (quotes) do manual.
4. Se perguntar sobre equipamento blacklist (convencional/marketing), responder: "🚫 Este equipamento não é inverter/técnico e foi filtrado."

## Exemplo de Interação

**Will-dev:** /hvac search "Erro E4" Samsung WindFree
**Bot:** 🔍 Consultando base técnica...

**Resultado:**
> "E4: Erro no sensor de temperatura do evaporador (aberto/curto)."
> *Fonte: Manual Serviço Samsung AR12TXEA, p. 52*

**Ação sugerida:** Verificar conexão do sensor CN43 ou trocar sensor (10kΩ).
