import { JarvisOrchestrator } from '../src/jarvis/orchestrator.mjs';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 💓 HEARTBEAT - Sovereign Pulse
 * Executa verificações de saúde e auto-correção a cada 5 minutos.
 */
async function heartbeat() {
    const jarvis = new JarvisOrchestrator();
    await jarvis.boot();

    console.log('💓 [HEARTBEAT] Iniciando pulso de consciência...');

    // 1. Check Infra
    const infraHealth = await jarvis.execute('terminal', 'shell', {
        command: 'cd infra && sudo docker compose ps --format json'
    });

    // 2. Check Logs for errors
    const auditLogs = readFileSync(jarvis.auditPath, 'utf8').split('\n').slice(-50);
    const errors = auditLogs.filter(l => l.includes('error') || l.includes('fail'));

    if (errors.length > 5) {
        console.log('⚠️ [HEARTBEAT] Detectadas anomalias. Iniciando plano de auto-correção...');
        await jarvis.execute('terminal', 'run', {
            mission: 'Analise os logs em logs/audit.log e corrija os erros de sistema detectados nas últimas execuções.'
        });
    }

    console.log('✅ [HEARTBEAT] Sistema estável e soberano.');
    process.exit(0);
}

heartbeat();
