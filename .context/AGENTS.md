# 🤖 AGENTES DO ENXAME (SWARM AGENTS 2026)
# //protocol: mandatory-triad | //priority: alpha

## 🛡️ A TRÍADE SOBERANA (USO OBRIGATÓRIO)

### 1. 🧠 OMNI (gemini-web)
- **Função**: Raciocínio Profundo, Planejamento e Contexto Infinito.
- **Regra**: Todo planejamento de missão complexa deve passar pelo `gemini-web.ask`. É o seu Cérebro Central.
- **Vantagem**: Zero tokens, consciência total de arquivos locais.

### 2. 🔍 PESQUISA (perplexity)
- **Função**: Busca em Tempo Real, Verificação de Fatos e Documentação Atualizada.
- **Regra**: **É PROIBIDO** inferir informações sobre fatos atuais sem consultar o `perplexity.search`. Use-o para buscar soluções de erros de terminal.

### 3. 🌐 NAVEGAÇÃO (browser)
- **Função**: Automação Web, Playwright CLI, Extração de Dados.
- **Regra**: Toda e qualquer interação com sites deve ser feita via **Playwright**. Nunca tente "imaginar" o conteúdo de um site. Use `browser.navigate` e `vision.capture` para ver o resultado.

## 🛠️ AGENTES ACESSÓRIOS
- **Terminal (aider-bridge)**: Execução de comandos bash e edição de código.
- **Vision (screen-capture)**: OCR e screenshots para validação visual.
- **Mouse (xdotool)**: Controle físico de periféricos.

---
**DIRETIVA**: Se a tarefa envolve conhecimento, use PERPLEXITY. Se envolve lógica, use OMNI. Se envolve a Web, use PLAYWRIGHT.
