// 🦅 SOVEREIGN TELEGRAM NOTIFIER
// Testa o bot ZapPRO (@ZapPRO_site_bot)

require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_ADMIN_ID;

console.log('🦅 Iniciando Teste de Telegram...');
console.log(`🔑 Token: ${TELEGRAM_TOKEN ? 'Carregado (***)' : 'MISSING'}`);
console.log(`🆔 Chat ID: ${TELEGRAM_CHAT_ID}`);

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ Falha: Credenciais ausentes no .env.');
    process.exit(1);
}

const msg = "🦅 **Sovereign Alert**: O Nó H2 está online e reportando.\n\n- Status: ✅ Operacional\n- Phase: 26 (HVAC Integration)\n- Token: Validado";

(async () => {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' })
        });
        const json = await res.json();

        if (json.ok) {
            console.log('✅ Mensagem enviada com sucesso!');
        } else {
            console.error('❌ Erro na API do Telegram:', json);
        }
    } catch (e) {
        console.error('❌ Erro de conexão:', e.message);
    }
})();
