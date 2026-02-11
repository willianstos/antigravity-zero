---
name: pdf-scraper-elite
description: Especialista em extração de PDFs usando Firecrawl e Playwright.
---

# PDF Scraper Elite

Esta habilidade permite que o bot extraia conteúdo de arquivos PDF em qualquer página web de forma automatizada.

## Comandos Disponíveis (via Agente)
- `node tools/pdf-scraper.mjs <URL>`: Executa a extração completa de uma URL (página ou PDF direto).

## Fluxo de Trabalho
1. O bot recebe uma URL.
2. Identifica se é um PDF direto ou uma página com links.
3. Tenta extrair usando Firecrawl API.
4. Se falhar, usa Playwright Browser para capturar o download binário.
5. Salva os resultados em `artifacts/pdfs/`.

## Exemplos
- "Scrape esse PDF: https://exemplo.com/relatorio.pdf"
- "Ache e extraia todos os PDFs desta página: https://exemplo.com/downloads"
