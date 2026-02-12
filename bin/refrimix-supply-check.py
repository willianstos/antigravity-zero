import asyncio
import sys
import os
from browser_use import Agent
from browser_use.llm import ChatOpenAI

# Jarvis v10.5 - Refrimix Supply Scraper (Fixed & Hygienic)
# Objetivo: Verificar estoque e preços em distribuidores HVACR.

async def check_supplies(query):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print(f"📊 [PROSPEÇÃO] Plano de busca para: {query}")
        return "Modo Autônomo em stand-by."

    try:
        llm = ChatOpenAI(model="gpt-4o")
        agent = Agent(
            task=f"Acesse sites de distribuidores HVACR no Brasil e procure por: {query}. Extraia o menor preço e disponibilidade.",
            llm=llm,
        )
        result = await agent.run()
        return result
    except Exception as e:
        print(f"🔹 Nota: {e}")
        return None

if __name__ == "__main__":
    item = sys.argv[1] if len(sys.argv) > 1 else "Compressor Scroll 5HP R410A"
    print(f"📦 [MASTER PH-MAX] Iniciando análise de mercado: {item}")
    asyncio.run(check_supplies(item))
