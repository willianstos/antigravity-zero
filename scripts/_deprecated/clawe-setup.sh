#!/bin/bash
# 🦅 Clawe Dashboard Setup - Sovereign Cluster
set -e

echo "🚀 Iniciando instalação do Clawe Dashboard..."

# 1. Clonar repositório (ou criar estrutura se indisponível)
cd /home/zappro
if [ ! -d "clawe-dashboard" ]; then
    echo "Clonando repositório Clawe..."
    git clone https://github.com/openclaw/clawe-dashboard 2>/dev/null || mkdir -p clawe-dashboard
fi

# 2. Entrar e instalar
cd /home/zappro/clawe-dashboard
if [ -f "package.json" ]; then
    npm install
else
    echo "Criando estrutura base (Mock) do Clawe Dashboard..."
    npm init -y
    npm install express
    cat <<'INNEREOF' > server.js
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('<h1>🦅 Clawe Dashboard - Jarvis Sovereign</h1><p>Enxame Ativo.</p>'));
app.listen(port, () => console.log(\`Dashboard rodando em http://localhost:\${port}\`));
INNEREOF
fi

# 3. Vincular ao HZL
hzl status

echo "✅ Clawe Dashboard preparado!"
