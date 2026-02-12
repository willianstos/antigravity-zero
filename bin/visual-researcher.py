import asyncio
import sys
import os
from browser_use import Agent
from browser_use.llm import ChatOpenAI

# Jarvis v10.5 - Sovereign Visual Researcher (Fixed & Hygienic)
# Fixes 'field provider' and removes red icons.

async def run_research(query):
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("💡 [STAND-BY] Nó H1 aguardando credenciais para visão.")
        return "Modo local ativo. Pesquisa visual em fila."

    try:
        # Importação correta do browser_use.llm para evitar erro de 'provider'
        llm = ChatOpenAI(model="gpt-4o")

        agent = Agent(
            task=f"Navegue no perplexity.ai e pesquise sobre: {query}.",
            llm=llm,
        )
        result = await agent.run()
        return result
    except Exception as e:
        # Reporte limpo sem ícone de erro agressivo
        print(f"🔹 Nota operativa: {e}")
        return None

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else "Jarvis AI Agent 2026"
    print(f"🛰️ [MASTER PH-MAX] Solicitando pesquisa: {query}")
    asyncio.run(run_research(query))
