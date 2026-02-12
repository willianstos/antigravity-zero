# Manual de Operações Táticas: Open Code CLI (2026) 🎮💻

Guia prático de operação do terminal Open Code no dia a dia do Enclave H2.

## 1. Modos de Operação (The Heart) 🫀
O CLI possui três modos distintos. Alterne digitando `/mode [nome]`.

- **`Chat` (Default)**: Discussão teórica, explicação e debug leve. *Não altera arquivos.*
- **`Build` (Engineering)**: O modo de construção. A IA tem permissão para **criar, editar e deletar** arquivos.
- **`Test` (QA)**: Focado em rodar suítes de teste e iterar até o "Green Light".

## 2. Slash Commands (Comandos de Barra) 🗡️
Comandos essenciais dentro da interface TUI (`opencode`):

| Comando | Função |
| :--- | :--- |
| `/add [caminho]` | Adiciona arquivo ao contexto (Memória de Trabalho). |
| `/drop [arquivo]` | Remove do contexto (Economia de Tokens). |
| `/ask "pergunta"` | Pergunta específica sobre o contexto atual. |
| `/fix` | Analisa e corrige o último erro de terminal/compilação. |
| `/commit` | Gera mensagem e commita alterações via Git. |
| `/mode [modo]` | Alterna entre Chat, Build e Test. |

## 3. Fluxo de Trabalho (Workflow v12.0) 🌊
Para maximizar o `gpt-5.1-codex-mini` ou similares:

1.  **Indexação**: O Open Code lê o `opencode.json` automaticamente.
2.  **Contexto**: Adicione os arquivos relevantes.
    ```bash
    /add src/routes/user.ts src/controllers/userController.ts
    ```
3.  **Execução**: Dê a ordem no modo Build.
    > "Crie um endpoint de validação de e-mail seguindo o padrão dos controllers adicionados."
4.  **Revisão (Diff)**: O CLI mostra o diff. Use setas para revisar, `Y` para aceitar.

## 4. Atalhos de Teclado (Shortcuts 2026) ⌨️
- **`Ctrl + R`**: Tentar rodar o projeto (via `package.json`/`Makefile`).
- **`Ctrl + L`**: Limpar histórico (Focus Mode).
- **`Tab`**: Autocomplete de arquivos e comandos.

---
*Jarvis v12.0 - Tactical Manual*
