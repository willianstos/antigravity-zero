#!/usr/bin/env node
// ================================================
// 🚀 MISSION CONTROL — Autonomous Execution Loop
// The engine of the "Executive Persona".
// Plans, Acts, Verifies, Fixes, Reports.
// ================================================

import { JarvisOrchestrator } from '../orchestrator.mjs';

class MissionControl {
    constructor(orchestrator = null) {
        this.jarvis = orchestrator;
    }

    async run({ mission }) {
        if (!this.jarvis) {
            const { JarvisOrchestrator } = await import('../orchestrator.mjs');
            this.jarvis = new JarvisOrchestrator();
            await this.jarvis.boot();
        }

        console.log(`🚀 [MISSÃO SOBERANA] Iniciando: ${mission}`);

        let currentState = "Início da missão.";
        let history = [];
        let iterations = 0;
        const MAX_ITERATIONS = 10;

        while (iterations < MAX_ITERATIONS) {
            iterations++;
            console.log(`🧠 [LOOP ${iterations}] Raciocinando...`);

            const PROMPT_REASONING = `
VOCÊ É O BRAÇO EXECUTOR DO JARVIS. MISSÃO: "${mission}"
ESTADO ATUAL DO SISTEMA: ${currentState}
HISTÓRICO DE AÇÕES: ${history.join(' -> ')}

O QUE DEVE SER FEITO AGORA?
Responda APENAS com JSON:
{
  "thought": "Explicação lógica do próximo passo",
  "action": "terminal.shell" | "vision.capture" | "browser.navigate" | "mission.complete",
  "params": { ... },
  "done": true/false
}
`;

            const brainRes = await this.jarvis.execute('openai', 'ask', { prompt: PROMPT_REASONING });
            const decision = JSON.parse(brainRes.result?.text.match(/\{[\s\S]*\}/)[0]);

            console.log(`💭 Pensamento: ${decision.thought}`);

            if (decision.done || decision.action === 'mission.complete') {
                console.log('✅ [MISSÃO] Concluída com sucesso.');
                break;
            }

            // Executar Ação
            const [agent, action] = decision.action.split('.');
            const result = await this.jarvis.execute(agent, action, decision.params);

            // Observar Resultado
            const output = result.success ? (result.result?.stdout || result.result || 'Sucesso') : (result.error || 'Falha');
            history.push(`${decision.action}(${output.toString().substring(0, 50)})`);

            // Atualizar Estado
            currentState = `Última ação: ${decision.action}. Resultado: ${output.toString().substring(0, 200)}`;

            if (!result.success) {
                console.log(`⚠️ [ALERTA] Ação falhou. O cérebro tentará corrigir no próximo loop.`);
            }
        }

        return {
            status: iterations >= MAX_ITERATIONS ? 'TIMEOUT' : 'COMPLETED',
            mission,
            history
        };
    }

    _extractCommands(text) {
        if (typeof text !== 'string') return [];
        // Extract bash/shell blocks
        const blocks = text.match(/```(?:bash|sh|shell)?\n([\s\S]*?)```/g) || [];
        if (blocks.length > 0) {
            return blocks.map(b => b.replace(/```(bash|sh|shell)?\n|```/g, '').trim())
                .join('\n')
                .split('\n')
                .filter(line => line.trim().length > 3 && !line.startsWith('#'));
        }
        // Fallback to lines starting with $
        return text.split('\n')
            .filter(l => l.startsWith('$ '))
            .map(l => l.replace(/^\$ /, '').trim());
    }

    _isError(res) {
        return !res || res.error || (res.stderr && res.stderr.length > 0);
    }
}

export { MissionControl };
