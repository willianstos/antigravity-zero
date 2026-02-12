#!/usr/bin/env python3
import os
import sys
from openai import OpenAI
from dotenv import load_dotenv

def process_hvac_manual(md_path):
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ ERRO: OPENAI_API_KEY não encontrada.")
        return

    print(f"📡 Lendo Manual: {md_path}")
    with open(md_path, 'r') as f:
        content = f.read()[:15000]  # Pegando o início para contexto técnico

    client = OpenAI(api_key=api_key)
    
    prompt = f"""
    Como um engenheiro sênior da Refrimix especializado em sistemas VRV/VRF e tecnologia Inverter:
    Analise o seguinte manual técnico e gere uma lista de 200 perguntas e respostas técnicas (FAQ).
    
    FOCO:
    1. Diagnóstico de falhas em placas eletrônicas e módulos IPM.
    2. Erros de comunicação entre unidades internas e externas.
    3. Previsão de defeitos futuros baseada no tempo de uso e condições ambientais.
    4. Procedimentos de emergência para manter o sistema operando.

    MANUAL (Markdown):
    {content}
    
    Responda em formato Markdown, numerado, direto e altamente técnico para outros engenheiros.
    """

    print("🧠 Gerando Inteligência (FAQ 200)...")
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": "Você é o Jarvis, o cérebro técnico da Refrimix."},
                      {"role": "user", "content": prompt}]
        )
        
        faq_content = response.choices[0].message.content
        output_path = md_path.replace(".md", "-faq200.md")
        
        with open(output_path, 'w') as f:
            f.write(faq_content)
        
        print(f"✅ Sucesso! FAQ salvo em: {output_path}")
    except Exception as e:
        print(f"⚠️ Erro no processamento: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 hvac-intel.py <caminho_md>")
    else:
        process_hvac_manual(sys.argv[1])
