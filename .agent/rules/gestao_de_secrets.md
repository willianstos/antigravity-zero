# Regra: Gestão de Secrets (Protocolo {KEY})

## Contexto
Para garantir a soberania e segurança do ambiente, nenhuma secret (chave, senha, token) deve ser escrita em texto puro em arquivos de documentação, logs de chat ou código-fonte.

## Diretrizes de Ofuscação
1. **Padrão Template**: Sempre que uma secret do `.env` for mencionada em PRDs, Implementation Plans ou Mensagens ao Usuário, use o formato `{NOME_DA_VAR}`.
   - *Exemplo*: Use `{TELEGRAM_BOT_TOKEN}` em vez da chave real.
2. **Separação de Preocupações**: As chaves reais devem residir EXCLUSIVAMENTE no arquivo `.env` (ou no Keyring do SO no Modo Liberal).
3. **Auditoria Proativa**: O bot deve realizar varreduras periódicas para garantir que nenhuma secret vazou para o histórico do Git ou arquivos de artefato.

## Uso em Código
- Em Javascript: `process.env.VARIABLE_NAME`
- Em Shell: `${VARIABLE_NAME}`
- Em Terraform: `var.variable_name` (vindo de env vars `TF_VAR_...`)

---
*Assinado: CISO Antigravity - 10/02/2026*
