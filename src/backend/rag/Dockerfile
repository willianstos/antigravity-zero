FROM node:22-slim

# Instalar dependências de sistema (para @docling se necessário)
# RUN apt-get update && apt-get install -y python3 ...

WORKDIR /app

# Copiar dependências
COPY package.json package-lock.json ./
RUN npm ci

# Scripts e Configs (mantém estrutura original)
COPY backend/rag/ ./backend/rag/
COPY data/ ./data/

# Criar pastas persistentes
RUN mkdir -p data/pdfs/{inbox,approved,rejected,processing} data/markdown data/qdrant

# Usuário não-root
USER node

# Default command (API ou Worker)
CMD ["node", "backend/rag/hvac-api.mjs"] 
# Será definido pelo k8s
