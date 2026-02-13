import os
from openai import OpenAI
from dotenv import load_dotenv

def valida_openai():
    print("🦞 Iniciando Validação Soberana - OpenAI 🦞")
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("❌ ERRO: OPENAI_API_KEY não encontrada no .env")
        return

    try:
        client = OpenAI(api_key=api_key)
        print(f"📡 Conectando ao modelo gpt-4o-mini...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Responda apenas: Jarvis Online no H2."}],
            max_tokens=20
        )
        print(f"✅ RESPOSTA: {response.choices[0].message.content}")
        print("🟢 Autenticação e Cota: OK!")
    except Exception as e:
        print(f"❌ FALHA NA VALIDAÇÃO: {str(e)}")

if __name__ == "__main__":
    valida_openai()
