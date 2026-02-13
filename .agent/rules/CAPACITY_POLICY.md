# 🦅 POLÍTICA DE CAPACIDADE SOBERANA (H2 Cluster) - v9.0
## Hardware Spec (Antigravity Desktop 2026)
- **CPU**: Ryzen 5 5600X | **GPU**: NVIDIA RTX 3060 (12GB VRAM) | **RAM**: 32GB

## ⚖️ Estratégia de Rate Limit & Orquestração

### 1. Córtex Visual (vLLM Qwen2-Omni)
- **Vision Feed Loop**: O `bin/vision-feed.mjs` deve rodar a **1 FPS** durante tarefas LAM.
- **Concurrency**: Máximo **1** tarefa de visão multimodal (Omni) por vez para preservar VRAM.
- **Grounding**: Toda ação de clique/tipo no desktop deve ser validada visualmente pelo Omni antes da execução.

### 2. Processamento & Ingestão (CPU 5600X)
- **Docling / PDF Ingestion**: Máximo **4** arquivos simultâneos.
- **Navegação Agentic (Playwright)**: Sempre mode `headless: false` quando o Omni estiver monitorando a tarefa.

### 3. Armazenamento & Limpeza (Janitor Protocol)
- **Context Threshold**: Ao atingir **75%**, o `bin/janitor-protocol.mjs` é mandatório.
- **Vision Artifacts**: Frames capturados pelo Córtex Visual são mantidos em buffer rotativo de **5 frames**.

## 🏛️ Governança ATS (Orchestrator)
- **Visual Validation**: O ATS só considera uma tarefa LAM como "Concluída" se houver uma confirmação visual do Omni no log.
- **Prioridade**: Visual Feedback (OMNI) > Ingestão PDF > Background Tasks.

*Assinado: Jarvis Sovereign Visual Orchestrator*
