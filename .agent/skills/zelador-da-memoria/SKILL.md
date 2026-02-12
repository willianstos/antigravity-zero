---
name: zelador-da-memoria
description: Manutenção de lições aprendidas e memória de experiência pós-morte de bugs.
---

# 🧹 Skill: Zelador da Memória (Experiência Soberana)

Esta skill define como o Jarvis deve aprender com seus erros e sucessos, transformando resoluções de problemas em conhecimento permanente.

## 📜 O Protocolo "Post-Mortem"

Toda vez que um problema complexo for resolvido (ex: bugs de infra, erros de API, conflitos de permissão):

1.  **Analise**: O que quebrou? Por que quebeou? Qual foi a "bala de prata"?
2.  **Documente**: Crie um arquivo em `.agent/memory/LESSONS/` com o padrão `L-YYYY-MM-DD-nome-do-erro.md`.
3.  **Indexe**: Salve o resumo técnico no Qdrant (Coleção `domain-code`).

## 🧱 Estrutura da Lição

- **Sintoma**: O que o usuário ou o log reportou.
- **Causa Raiz**: Onde estava a falha técnica (ex: `chattr +i` impedindo o `sed`).
- **Solução**: O comando mastigado que resolveu.
- **Prevenção**: O que foi feito para nunca mais ocorrer (ex: automatizar o `chattr -i` no script).

## 🚀 Ciclo de Automação

Ao iniciar uma tarefa, o Jarvis deve:
1.  Verificar se existe uma lição parecida no `.agent/memory/LESSONS/`.
2.  Se existir, aplicar a solução de elite imediatamente.

---
*Assinado: Jarvis Sovereign - Aprender é a maior Soberania.*
