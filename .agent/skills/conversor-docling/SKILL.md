---
name: conversor-docling
description: Conversão de PDF para Markdown de alta fidelidade usando IBM Docling. Preserva tabelas, figuras e layout.
---

# 📄 Conversor Docling (PDF → Markdown)

> Converte PDFs complexos em Markdown limpo preservando tabelas, figuras, cabeçalhos e layout. Powered by IBM.

## Stack
- **Engine:** Docling (IBM Open Source)
- **Runtime:** Python 3.10+
- **OCR:** DocTR (opcional, para PDFs escaneados)
- **Output:** Markdown (.md) ou JSON

## Setup

### 1. Instalar Docling
```bash
pip install docling
# Com OCR (para PDFs escaneados):
pip install "docling[ocr]"
```

### 2. Verificar
```bash
python3 -c "from docling.document_converter import DocumentConverter; print('✅ Docling OK')"
```

## Uso

### CLI rápido (1 arquivo)
```bash
docling convert /caminho/para/arquivo.pdf --output /caminho/saida/
```

### Script Python (batch)
```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("/caminho/para/arquivo.pdf")

# Exportar como Markdown
md_content = result.document.export_to_markdown()
with open("output.md", "w") as f:
    f.write(md_content)
```

### Batch (pasta inteira)
```python
from pathlib import Path
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
input_dir = Path("./pdfs")
output_dir = Path("./markdown")
output_dir.mkdir(exist_ok=True)

for pdf in input_dir.glob("*.pdf"):
    result = converter.convert(str(pdf))
    md = result.document.export_to_markdown()
    (output_dir / f"{pdf.stem}.md").write_text(md)
    print(f"✅ {pdf.name} → {pdf.stem}.md")
```

## Vantagens sobre outros conversores

| Feature | Docling | PyPDF | pdfplumber |
|---|---|---|---|
| Tabelas preservadas | ✅ Excelente | ❌ | ⚠️ Parcial |
| Figuras/imagens | ✅ Detecta e referencia | ❌ | ❌ |
| Layout/hierarquia | ✅ Headers corretos | ❌ | ❌ |
| OCR built-in | ✅ (com flag) | ❌ | ❌ |
| Markdown output | ✅ Nativo | ❌ | ❌ |

## Pipeline com Qdrant (RAG)

```
PDF → Docling → Markdown → Chunking → Embeddings → Qdrant
                                                      ↓
                              Pergunta → Busca → Contexto → LLM → Resposta
```

### Fluxo completo:
1. **Docling** converte PDF → Markdown limpo
2. Markdown salvo em `backend/scraping/output/`
3. **Motor RAG** chunka e indexa no Qdrant
4. Bot responde perguntas com base nos PDFs

## Comandos para o Bot (Telegram)

```
/pdf convert <URL>      → Baixar PDF e converter para MD
/pdf batch <pasta>      → Converter todos PDFs da pasta
/pdf index <arquivo>    → Converter e indexar no Qdrant
```

## Diretórios

```
backend/scraping/
├── input/        ← PDFs brutos (download)
├── output/       ← Markdown convertidos
└── cache/        ← Cache de conversões anteriores
```
