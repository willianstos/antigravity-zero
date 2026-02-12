import asyncio
import sys
import os
from browser_use import Agent
from langchain_openai import ChatOpenAI

# Jarvis v10.0 - Sovereign Visual Researcher (Honest Mode)
# Protocol: QA/S - Iron Architect

async def run_research(query):
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("❌ ERRO CRÍTICO: OPENAI_API_KEY não detectada.")
        print("🛑 STATUS: BLOCKED. O Jarvis não pode 'enxergar' sem o motor de IA.")
        return None

    try:
        llm = ChatOpenAI(model="gpt-4o", api_key=api_key)
        
        # Bypassing pydantic validation error if it occurs
        if not hasattr(llm, 'provider'):
            llm.provider = 'openai'

        agent = Agent(
            task=f"Navegue no perplexity.ai e pesquise sobre: {query}.",
            llm=llm,
        )
        result = await agent.run()
        return result
    except Exception as e:
        print(f"❌ FALHA NA OPERAÇÃO: {e}")
        return None

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else "Jarvis AI Agent 2026"
    print(f"🚀 [SOVEREIGN MASTERY] Solicitando pesquisa visual: {query}")
    
    res = asyncio.run(run_research(query))
    
    if res:
        print(f"✅ SUCESSO: {res}")
        sys.exit(0)
    else:
        print("🚨 CICLO INTERROMPIDO. Verifique os conectores de IA.")
        sys.exit(1) # Exit code 1 para que o bash && não siga falso.
