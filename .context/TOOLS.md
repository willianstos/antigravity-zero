# 🛠️ CAIXA DE FERRAMENTAS SOBERANA (TOOLS 2026)

## 🎭 PROTOCOLO DE USO OBRIGATÓRIO

### OMNI (Cérebro Gemini Pro)
- **Localização**: `src/jarvis/browser/gemini-web.mjs`
- **Uso**: Chamado via `gemini-web.ask`. 
- **Mandato**: Use para analisar blocos grandes de código, planejar MISSÕES e tomar decisões arquiteturais.

### PERPLEXITY (Olhos de Pesquisa)
- **Localização**: `src/jarvis/search/perplexity-search.mjs`
- **Uso**: Chamado via `perplexity.search`.
- **Mandato**: Use sempre que o Líder perguntar sobre notícias, cotações, tutoriais técnicos ou erros de terminal desconhecidos.

### PLAYWRIGHT (Mãos do Navegador)
- **Localização**: `src/jarvis/browser/playwright-cli.mjs`
- **Uso**: Chamado via `browser.navigate`, `browser.click`, `browser.type`.
- **Mandato**: Use para login em sites, extração de dados (scraping) e automação de tarefas repetitivas na web.

## ⚙️ CONFIGURAÇÕES DE SISTEMA
- **Porta Principal**: 7777 (Dashboard/API)
- **Sudo**: Liberado via `/etc/sudoers.d/jarvis-sovereign`
- **Browser Profile**: Localizado em `/home/zappro/.config/google-chrome` (Sessões logadas via Playwright).

---
**NOTA**: Falhar em usar a ferramenta correta para a tarefa correta resulta em "Degradação de Kernel". OMNI + PERPLEXITY + PLAYWRIGHT = JARVIS SOBERANO.
