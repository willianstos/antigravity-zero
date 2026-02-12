# 🦅 POLÍTICA DE CAPACIDADE SOBERANA (H2 Cluster)
## Hardware Spec (Antigravity Desktop 2026)
- **CPU**: Ryzen 5 5600X (6 Cores / 12 Threads)
- **GPU**: NVIDIA RTX 3060 (12GB VRAM)
- **RAM**: 32GB DDR4
- **Storage**: 500GB NVMe Gen3

## ⚖️ Estratégia de Rate Limit & Orquestração

### 1. Inferencia & Visão (GPU RTX 3060)
- **Model Loop**: Qwen2.5-Omni-7B (Vision/Text).
- **Concurrency**: 
    - **Vision (Image/PDF analysis)**: Máximo **1** tarefa por vez.
    - **Text (Chat/FAQ)**: Máximo **2** tarefas por vez.
- **VRAM Reserve**: Manter pelo menos 1GB livre para o Xorg e GUI do Xubuntu.

### 2. Processamento & Ingestão (CPU 5600X)
- **Docling / PDF Ingestion**: Máximo **4** arquivos simultâneos para evitar saturação de I/O e CPU.
- **Node.js Workers**: Rodar com limite de memória de 2GB (`--max-old-space-size=2048`).
- **Navegação Agentic (Playwright)**: Máximo **2** instâncias de navegador visíveis para controle manual secundário.

### 3. Armazenamento & Limpeza (Janitor Protocol)
- **Context Threshold**: Ao atingir **75%** do limite de tokens da janela de contexto, o `bin/janitor-protocol.mjs` **DEVE** ser disparado.
- **Artifacts Retention**: Logs e screenshots em `/artifacts/` mantidos por **7 dias**, depois compactados ou deletados.

## 🏛️ Governança ATS (Orchestrator)
- **Self-Healing**: Se um container LocalStack falhar, o ATS deve tentar o restart e reportar na Ata.
- **Rate Limit**: Respeitar a concorrência de 1 tarefa de Visão por vez na 3060.
- **Prioridade Máxima**: Monitoramento Refrimix > Automação HVAC > Background Tasks.

*Assinado: Jarvis Sovereign Orchestrator*
