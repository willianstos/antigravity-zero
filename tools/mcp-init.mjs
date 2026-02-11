/**
 * 🛠️ MCP Taskmaster Phase Initializer
 * Versão: 1.0 (10/02/2026)
 */

import fs from 'fs';
import path from 'path';

const phaseName = process.argv[2] || 'nova-fase';
const phaseId = new Date().getTime();
const phaseDir = path.join('.agent/phases', `phase-${phaseId}-${phaseName}`);

// 1. Criar estrutura
fs.mkdirSync(path.join(phaseDir, 'logs'), { recursive: true });

// 2. Gerar PRD.md Template
const prdTemplate = `
# PRD da Fase: ${phaseName} (ID: ${phaseId})
//full-auto

## 🎯 Objetivo
[Descreva o objetivo da fase aqui]

## 🏗️ Arquitetura Técnica
- Infra: [Ex: LocalStack S3 + K3s Pod]
- Fluxo: [Ex: Scraping -> Telegram]

## 🎭 Roles & Skills
- Role: [Ex: Arquiteto de Nuvem]
- Skills: [Ex: arquiteto-de-nuvem, rastreador-firecrawl]

## ✅ Lista de Tarefas
- [ ] Passo 1: Configurar ambiente local
- [ ] Passo 2: Implementar código core
- [ ] Passo 3: Testar e Validar
`;

fs.writeFileSync(path.join(phaseDir, 'PRD.md'), prdTemplate.trim());
fs.writeFileSync(path.join(phaseDir, 'tasks.json'), JSON.stringify({ status: 'pending', tasks: [] }, null, 2));

console.log(`✅ Fase "${phaseName}" inicializada em: ${phaseDir}`);
