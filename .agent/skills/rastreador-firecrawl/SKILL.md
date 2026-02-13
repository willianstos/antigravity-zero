---
name: rastreador-firecrawl
description: Habilidade de extração de elite para busca e mapeamento web de alta escala.
---

# Habilidade: Rastreador Firecrawl

## Objetivo
Realizar extrações de dados web complexos, estruturados e em larga escala, mantendo a eficiência de tokens e bypass de anti-bot.

## Instruções de Uso
1.  **Busca de PDFs**: Use o Firecrawl para localizar URLs de documentos e o `navegador-automatizado` (Playwright) para realizar o download seguro.
2.  **Extração Limpa**: Utilize `--only-main-content` no comando `scrape` para evitar poluição de menus e rodapés.
3.  **Comandos Principais**:
    - `firecrawl search "pdf tutorial nodejs"`: Localiza documentos relevantes.
    - `firecrawl scrape https://url --only-main-content`: Captura o conteúdo essencial.

## Exemplos (Foco em PDF)
- **Cenário**: Localizar e baixar relatórios financeiros.
- **Passo 1**: `firecrawl search "relatorio financeiro 2025 filetype:pdf"`
- **Passo 2**: Usar o link retornado no `navegador-automatizado` para o download.

## Sinergia Vision (Futuro)
- Integrar com **VLLM Vision** para analisar o layout do PDF antes ou após o download.

## Limites e Regras
- **Custo**: Cada comando consome créditos do Firecrawl. Use com sabedoria para tarefas de "Elite".
- **Localização**: As saídas são preferencialmente em Markdown ou JSON para facilitar o processamento.

---
*Atualizado em: 10/02/2026*
*Status: Pronto para o combate*
