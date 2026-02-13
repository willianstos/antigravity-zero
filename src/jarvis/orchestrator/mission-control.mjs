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

        console.log(`🚀 [MISSÃO] Inicializando: ${mission}`);

        // 1. Planejar usando Gemini Web (Custo Zero de Token)
        console.log('🧠 [MISSÃO] Planejando...');
        const planRes = await this.jarvis.execute('gemini-web', 'ask', {
            prompt: `Como um DevOps Senior, crie um plano de comandos bash sequenciais para esta missão: "${mission}". Use comandos reais (docker, git, npm, echo). Responda APENAS com os blocos de código contendo os comandos.`
        });

        // Handle result structure from execute()
        const text = planRes.result?.text || planRes.result || '';
        const commands = this._extractCommands(text);
        console.log(`📋 [MISSÃO] Passos detectados: ${commands.length}`);

        if (commands.length === 0) {
            throw new Error("Não consegui extrair comandos válidos do plano.");
        }

        const history = [];

        // 2. Executar & Verificar
        for (const cmd of commands) {
            console.log(`⚡ [MISSÃO] Executando: ${cmd}`);
            let attempts = 0;
            let success = false;

            while (attempts < 2 && !success) {
                const result = await this.jarvis.execute('terminal', 'shell', { command: cmd });
                const resData = result.result || result;

                if (result.success && !this._isError(resData)) {
                    success = true;
                    console.log(`  ✅ Sucesso`);
                    history.push(`✅ ${cmd}`);
                } else {
                    attempts++;
                    console.log(`  ⚠️ Falha (${attempts}). Buscando correção...`);
                    const errorMsg = resData.error || resData.stderr || 'Unknown terminal error';
                    const fixRes = await this.jarvis.execute('perplexity', 'quickSearch', {
                        query: `Erro ao executar "${cmd}" no Ubuntu: ${errorMsg}. Como corrigir via terminal?`
                    });
                    const fixText = fixRes.result || '';
                    const fixCmd = this._extractCommands(fixText)[0];
                    if (fixCmd) {
                        await this.jarvis.execute('terminal', 'shell', { command: fixCmd });
                        history.push(`🔧 Applied fix: ${fixCmd}`);
                    }
                }
            }
        }

        // 3. Final Verification
        console.log('📸 [MISSION] Final visual verification...');
        const evidence = await this.jarvis.execute('vision', 'capture', {});

        return {
            status: 'COMPLETED',
            mission,
            evidence: evidence.result?.path,
            log: history.join('\n')
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
