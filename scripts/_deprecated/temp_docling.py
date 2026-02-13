from docling.document_converter import DocumentConverter
import sys
converter = DocumentConverter()
result = converter.convert(sys.argv[1])
print(result.document.export_to_markdown())