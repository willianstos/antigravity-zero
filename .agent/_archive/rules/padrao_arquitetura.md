# Padrão de Arquitetura (Antigravity 2026)

Este documento manda na estrutura do repositório `antigravity-zero`, seguindo o padrão oficial do Google para 2026.

## Estrutura em Camadas (O Jeito Certo)

Pra não virar bagunça ("Context Hell"), separamos tudo assim:

1.  **Regras (`.agent/rules/`) - Sempre ON**:
    - Guia o meu comportamento e os limites de segurança.
    - **Atenção**: Nada de scripts ou exemplos gigantes aqui; só o que é regra de ouro.

2.  **Processos (`.agent/workflows/`) - Sob Demanda**:
    - São os atalhos que você chama com `/`. 
    - Servem para rotinas rápidas.

3.  **Habilidades (`.agent/skills/`) - Contexto Pesado**:
    - Pastas com `SKILL.md` + scripts e exemplos.
    - Eu só "equipo" essa pasta quando sinto que a tarefa precisa disso. É onde mora o conhecimento "bruto".

## Qualidade e Atualidade
- **Carimbo de Data**: Tudo que eu criar tem que ter a data da última mexida.
- **Data de Corte**: Minhas referências são de **Fevereiro de 2026**.
- **Localização**: Documentos em PT-BR para facilitar sua leitura.

---
*Última Faxina: 10/02/2026*
*Status: 100% Organizado*
