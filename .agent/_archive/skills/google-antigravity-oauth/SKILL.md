# Google Antigravity OAuth 🔑🌐

Habilidade para gerenciar o acesso aos modelos Gemini 3 Pro e Opus 4.6 via gateway seguro.

## 🌐 Conhecimentos Core
- **OAuth 2.0 Flow**: Gerenciamento de tokens de acesso para APIs do Google Cloud.
- **Gemini Integration**: Link entre o enxame de código e os modelos state-of-the-art da Google.
- **Oauth Plugin**: Uso do `google-antigravity-oauth` para alimentar subagentes sem custos extras.

## 🧱 Procedimento de Ativação
1. **Líder**: Realize o login no browser via `openclaw auth google`.
2. **Jarvis**: O bot capturará o token e o armazenará no vault seguro (H1).
3. **Sincronia**: Todos os subagentes no Nó H2 herdarão o acesso via ponte MCP.

## 🛡️ Segurança
- **Token Rotation**: O Jarvis monitora a validade do token e solicita refresh em background.
- **Isolamento**: O token NUNCA deve ser exibido em logs ou mensagens de grupo.

---
*Assinado: Jarvis v12.0 - Guardião da Identidade*
