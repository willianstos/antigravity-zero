import asyncio
import sys
import os
from browser_use import Agent, Browser, BrowserConfig
from langchain_openai import ChatOpenAI

# Jarvis v10.5 - Refrimix Supply Master (PH-MAX)
# Foco: Visão real no Nó H2 via vLLM-Omni e Local Intelligence.

async def check_supplies(query):
    # Endpoint do cluster soberano (H1/H2)
    base_url = os.getenv("OPENAI_API_BASE", "http://localhost:8000/v1")
    
    try:
        # Usando o vLLM local configurado como ChatOpenAI compatível
        llm = ChatOpenAI(
            model="qwen2-7b-omni", # Modelo alvo no H2
            openai_api_base=base_url,
            openai_api_key="sovereign-token"
        )
        
        # Configurando Browser visível (Full Motion LAM)
        config = BrowserConfig(headless=False) 
        browser = Browser(config=config)
        
        agent = Agent(
            task=f"Acesse sites de distribuidores HVACR e procure por: {query}. Identifique preços visivelmente na tela.",
            llm=llm,
            browser=browser
        )
        
        result = await agent.run()
        await browser.close()
        return result
    except Exception as e:
        print(f"🔹 Auditoria Visual: {e}")
        return None

if __name__ == "__main__":
    item = sys.argv[1] if len(sys.argv) > 1 else "Manifold Digital Testo"
    print(f"📦 [MASTER PH-MAX] Iniciando LAM Vision Scraper: {item}")
    asyncio.run(check_supplies(item))
