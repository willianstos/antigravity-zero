import 'dotenv/config';
import OpenAI from 'openai';

async function testOpenAI() {
    console.log('🦅 **Sovereign OpenAI Smoke Test**');
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes('{chave}')) {
        console.error('❌ Erro: OPENAI_API_KEY não configurada ou inválida no .env');
        process.exit(1);
    }

    const openai = new OpenAI({ apiKey });

    try {
        console.log('📡 Enviando ping para OpenAI (gpt-4o-mini)...');
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Pinguim Soberano? Responda apenas: 'Sincronizado'." }],
            max_tokens: 10
        });

        const reply = completion.choices[0].message.content;
        console.log(`📥 Resposta: "${reply}"`);

        if (reply.includes('Sincronizado')) {
            console.log('✅ **OpenAI Sincronizada com Sucesso!** [200 OK Real]');
        } else {
            console.log('⚠️ Resposta inesperada, mas comunicação OK.');
        }
    } catch (e) {
        console.error(`❌ Falha na Conectividade OpenAI: ${e.message}`);
        process.exit(1);
    }
}

testOpenAI();
