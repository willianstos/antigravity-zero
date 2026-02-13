# PRD - Fase 06: PDF Scraper Elite com Firecrawl API

**Fase ID**: `PH-06-PDF-SCRAPER-ELITE`  
**Data de Criação**: 2026-02-11  
**Responsável**: Agente Antigravity (Especialista em Web Scraping)  
**Status**: 🟡 Planejamento
//full-auto
//auto-pilot
//sudo-level:1
//performance-mode:turbo
---

## 🎯 Objetivo da Fase

Tornar o Agente Antigravity um **especialista em web scraping de PDFs**, com capacidade de:
- Identificar, extrair e processar documentos PDF de qualquer website
- Utilizar a **Firecrawl API** como ferramenta primária de extração
- Aplicar **Playwright** para navegação complexa e fallback
- Gerar relatórios estruturados e análises de conteúdo PDF

---

## 🏗️ Arquitetura Técnica

### Stack Principal
```
┌─────────────────────────────────────────────┐
│           Agente Antigravity                │
│  (OpenClaw Bot + Claude 4.5 Sonnet)         │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   ┌────▼────┐       ┌──────▼──────┐
   │Playwright│       │ Firecrawl   │
   │  CLI     │       │   API       │
   └────┬────┘       └──────┬──────┘
        │                   │
        └─────────┬─────────┘
                  │
          ┌───────▼────────┐
          │  PDF Processor │
          │  (Text Extractor)│
          └────────────────┘
```

### Componentes
1. **Playwright**: Automação de navegador para descoberta de PDFs
2. **Firecrawl API**: Extração prioritária de conteúdo de PDFs
3. **Antigravity Preview**: Captura de screenshots para validação visual
4. **Browse-Use Mode**: Interações web avançadas e JavaScript customizado

---

## 🧑‍💻 Roles & Skills Utilizadas

### Skills Ativadas
- **`navegador-automatizado`**: Para controle do Playwright
- **`rastreador-firecrawl`**: Para extração de PDFs via Firecrawl API
- **`administrador-do-sistema`**: Para comandos sudo e gestão de ambiente
- **`zelador-do-codigo`**: Para manter o código organizado

### Permissions Especiais
- ✅ **Sudo Access**: Senha `1` (autorizada para testes)
- ✅ **Browser Control**: Acesso total ao Chrome/Chromium headless
- ✅ **File System**: Leitura/escrita em `/home/zappro/antigravity-zero/artifacts/`

---

## 📋 Lista de Tarefas (Checklist Granular)

### 6A - Configuração do Ambiente
- [ ] 6A-1: Validar instalação do Playwright CLI
- [ ] 6A-2: Configurar credenciais da Firecrawl API no `.env`
- [ ] 6A-3: Criar diretório de artefatos: `artifacts/pdfs/`
- [ ] 6A-4: Testar conexão com Firecrawl API (health check)

### 6B - Implementação do Core Scraper
- [ ] 6B-1: Criar script `tools/pdf-scraper.mjs` com lógica de descoberta
- [ ] 6B-2: Implementar função `discoverPDFs(url)` usando Playwright
- [ ] 6B-3: Implementar função `extractPDFWithFirecrawl(pdfUrl)`
- [ ] 6B-4: Implementar fallback `downloadPDFWithPlaywright(pdfUrl)`

### 6C - Casos de Uso e Validação
- [ ] 6C-1: Testar extração de PDF público (ex: whitepaper da OpenAI)
- [ ] 6C-2: Testar PDF que requer navegação (ex: formulário pré-download)
- [ ] 6C-3: Testar PDF gerado dinamicamente (ex: relatório via POST)
- [ ] 6C-4: Gerar relatório de análise de conteúdo extraído

### 6D - Integração com OpenClaw
- [ ] 6D-1: Criar comando Telegram `/scrape [URL]`
- [ ] 6D-2: Configurar resposta via Telegram com resumo do PDF
- [ ] 6D-3: Adicionar suporte a múltiplos PDFs em uma página
- [ ] 6D-4: Implementar cache de PDFs processados

### 6E - Otimização e Hardening
- [ ] 6E-1: Adicionar rate limiting para APIs externas
- [ ] 6E-2: Implementar retry logic com exponential backoff
- [ ] 6E-3: Gerar logs estruturados em `artifacts/logs/pdf-scraper.log`
- [ ] 6E-4: Documentar casos de edge (PDFs protegidos, CAPTCHAs, etc)

---

## 🚀 Protocolo de Execução

### Modo Manual
```bash
# Executar fase manualmente (passo a passo)
openclaw message send --channel telegram --message "Iniciar Fase 06: PDF Scraper"
```

### Modo //full-auto
```bash
# Executar todos os passos automaticamente
# Adicione a flag no topo deste arquivo e execute:
node .agent/workflows/mcp-taskmaster-executor.mjs PH-06
```

---

## 📊 Critérios de Sucesso

1. ✅ Extração bem-sucedida de 3+ PDFs de diferentes fontes
2. ✅ Taxa de sucesso > 80% com Firecrawl API
3. ✅ Fallback funcional para casos onde Firecrawl falha
4. ✅ Integração com Telegram funcionando
5. ✅ Logs e artefatos gerados corretamente

---

## 🛠️ Comandos Úteis

```bash
# Validar Playwright
playwright --version

# Testar Firecrawl API
curl -X POST "https://api.firecrawl.dev/v1/extract" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/sample.pdf"}'

# Executar scraper standalone
node tools/pdf-scraper.mjs "https://openai.com/research/gpt-4-technical-report.pdf"
```

---

**Assinado**: Agente Antigravity - Orquestrador de Elite  
**Data**: 2026-02-11T05:26:59-03:00
