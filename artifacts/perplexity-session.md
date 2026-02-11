# Manutenção de Sessão Perplexity

## Sessão Persistente
A automação utiliza um perfil de usuário persistente localizado em `~/pw-profiles/perplexity`. Isso significa que cookies e estados de login são salvos entre execuções.

## Como as Credenciais são usadas
O script `tools/perplexity-smoke.mjs` lê as credenciais do arquivo `.env`:
- `PERPLEXITY_EMAIL`
- `PERPLEXITY_PASSWORD`

Se o script detectar que você não está logado, ele tentará preencher esses campos automaticamente.

## O Chromium é suficiente?
Sim, o **Chromium** (base do Chrome) é tecnicamente idêntico ao Chrome na forma como armazena sessões, cookies e local storage. Para o Perplexity, o Chromium é perfeitamente capaz de manter você logado por longos períodos.

### Diferenças importantes:
- **Persistência Técnia**: Ambos salvam os dados da mesma forma no seu `userDataDir`.
- **Anti-Bot**: Em sites com proteção extrema, o **Google Chrome** (versão comercial) pode ser menos "visado" por ter fingerprints mais comuns de usuários reais.
- **Duração da Sessão**: O tempo que você permanece logado depende exclusivamente dos cookies do Perplexity e não do navegador. Se o Perplexity decidir que a sessão dura 30 dias, ela durará 30 dias no Chromium ou no Chrome.

### Se quiser usar o Google Chrome oficial:
Se você tiver o Chrome instalado no Ubuntu e preferir usá-lo, você pode alterar o script para:
```javascript
const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
  channel: 'chrome', // Força o uso do Chrome instalado no sistema
  headless: false,
  args: ['--disable-blink-features=AutomationControlled']
});
```

## Dicas de Manutenção
- **Não apague a pasta**: Se deletar `~/pw-profiles/perplexity`, você perderá todas as sessões ativas.
- **Mantenha o IP**: Alguns sites deslogam usuários se o IP mudar drasticamente de uma hora para outra.
