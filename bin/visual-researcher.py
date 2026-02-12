import asyncio
import sys
from browser_use import Agent
from langchain_openai import ChatOpenAI

# Config para usar o Omni ou API compatível
async def run_research(query):
    agent = Agent(
        task=f"Navegue no perplexity.ai e pesquise sobre: {query}. Extraia os pontos chave.",
        llm=ChatOpenAI(model="gpt-4o"), # Placeholder configurável
    )
    result = await agent.run()
    return result

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else "Jarvis AI Agent best practices 2026"
    print(f"🚀 Iniciando pesquisa visual: {query}")
    try:
        res = asyncio.run(run_research(query))
        print(f"✅ Resultado: {res}")
    except Exception as e:
        print(f"❌ Erro na pesquisa: {e}")
