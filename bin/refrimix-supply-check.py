import asyncio
import sys
import os
from browser_use import Agent
from langchain_openai import ChatOpenAI

# Jarvis v10.1 - Refrimix Supply Scraper
# Objetivo: Verificar estoque e preços em distribuidores HVACR.

async def check_supplies(query):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("💡 [MODE: SIMULADO] Pesquisando estoque para: " + query)
        await asyncio.sleep(2)
        return {"item": query, "status": "In Stock", "price": "R$ 1.250,00", "distributor": "Daikin Portal"}

    llm = ChatOpenAI(model="gpt-4o", api_key=api_key)
    if not hasattr(llm, 'provider'): llm.provider = 'openai'

    agent = Agent(
        task=f"Acesse sites de distribuidores HVACR no Brasil e procure por: {query}. Extraia o menor preço e disponibilidade.",
        llm=llm,
    )
    result = await agent.run()
    return result

if __name__ == "__main__":
    item = sys.argv[1] if len(sys.argv) > 1 else "Compressor Scroll 5HP R410A"
    print(f"🔍 [REFRIMIX-SUPPLY] Iniciando busca de suprimentos: {item}")
    try:
        res = asyncio.run(check_supplies(item))
        print(f"✅ RELATÓRIO DE SUPRIMENTOS:\n{res}")
    except Exception as e:
        print(f"❌ Erro na extração: {e}")
