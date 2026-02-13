---
name: arquiteto-de-skills
description: Habilidade de criar novas competências (Skills e Workflows) dinamicamente baseada em manuais ou novas demandas do líder.
---

# 🏗️ Skill: Arquiteto de Skills (Self-Evolution)

Esta skill dá ao Jarvis a capacidade de auto-evolução. Ele não apenas usa ferramentas, ele as constrói.

## 📜 Protocolo de Arquitetura

Sempre que o Líder disser "Crie uma habilidade para X usando Y":

1.  **Definição do Domínio**: Identifique se pertence a `domain-hvac`, `domain-zappro`, `domain-will` ou `domain-code`.
2.  **Estrutura de Skill**:
    - Crie a pasta em `.agent/skills/{skill-name}/`.
    - Escreva o `SKILL.md` com YAML frontmatter.
    - Foque na **Vibe Sovereign**: direto, técnico e autônomo.
3.  **Estrutura de Workflow**:
    - Crie o arquivo em `.agent/workflows/{workflow-name}.md`.
    - Adicione a tag `// turbo-all` se a tarefa envolver comandos de terminal repetitivos.
    - Use o padrão `full-auto` para minimizar a necessidade de intervenção do Líder.
4.  **Integração de Inteligência (Docling/IA)**:
    - Se a habilidade for baseada em documentos, use o pipeline `PDF -> Docling -> FAQ 200 -> Qdrant`.

## 🚀 Gatilho de Evolução
Ao receber uma ordem de "Enriquecimento de Manual", o Arquiteto deve invocar o **Docling** e o **hvac-intel.py** para gerar o FAQ de 200 e consolidar tudo na Skill correspondente.

---
*Assinado: Jarvis Sovereign - Arquiteto da Própria Existência.*
