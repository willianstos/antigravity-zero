import fs from 'fs';
import path from 'path';

// 🔍 HVAC Classifier v1.0
// Classifica documentos como whitelist (técnico inverter) ou blacklist (convencional/marketing)
// Análise por CONTEÚDO, não por nome de arquivo

const WHITELIST_INDICATORS = {
    high: [
        // Tecnologia Inverter
        /\binverter\b/i, /\bVRF\b/, /\bVRV\b/, /\bVFD\b/, /\bVSD\b/,
        /\bIGBT\b/, /\bIPM\b/, /\bcompressor\s+DC\b/i, /\bDC\s+inverter\b/i,
        /\bmotor\s+brushless\b/i, /\bBLDC\b/,
        // Componentes inverter
        /\bplaca\s+(inverter|inversora)\b/i, /\bboard\s+inverter\b/i,
        /\bdriver\s+board\b/i, /\bpower\s+module\b/i,
        /\bbarramento\s+DC\b/i, /\bDC\s+bus\b/i,
        /\bPWM\b/, /\bmodula[çc][ãa]o\b/i,
        // Inversores de frequência
        /\binversor\s+de\s+frequ[êe]ncia\b/i, /\bfrequency\s+drive\b/i,
        /\bvariable\s+frequency\b/i, /\bvariable\s+speed\b/i,
        // Diagramas
        /\besquem[áa]tico\b/i, /\bschematic\b/i, /\bwiring\s+diagram\b/i,
        /\bdiagrama\s+el[ée]trico\b/i,
    ],
    medium: [
        // Códigos de erro (padrão alfanumérico)
        /\bc[óo]digo\s+de\s+erro\b/i, /\berror\s+code\b/i, /\bfault\s+code\b/i,
        /\b[EFHLPUCdJ]\d{1,3}\b/,  // Padrões comuns: E1, F3, H6, L9, P0, U4
        // Specs técnicos
        /\bCOP\b/, /\bEER\b/, /\bSEER\b/, /\bISEER\b/,
        /\bBTU\b/i, /\bkcal\b/i,
        /\bR-?410[Aa]\b/, /\bR-?32\b/, /\bR-?22\b/,
        /\b\d+\s*[VvAaWw]\b/, /\btens[ãa]o\b/i, /\bcorrente\b/i,
        // Manutenção
        /\bmanuten[çc][ãa]o\s+(preventiva|corretiva)\b/i,
        /\bpreventive\s+maintenance\b/i,
        /\btroubleshooting\b/i, /\bdiagn[óo]stico\b/i,
    ],
};

const BLACKLIST_INDICATORS = {
    high: [
        // Convencional
        /\bconvencional\b/i, /\bon[\/-]off\b/i, /\bcompressor\s+(AC\s+)?fixo\b/i,
        /\bfixed\s+speed\s+compressor\b/i,
        // Marketing
        /\bpromo[çc][ãa]o\b/i, /\bdesconto\b/i, /\boferta\b/i,
        /\bligue\s+j[áa]\b/i, /\bcompre\s+agora\b/i,
        /\bpreço\s+especial\b/i, /\bfrete\s+gr[áa]tis\b/i,
        /\bcampanha\b/i, /\bblack\s+friday\b/i,
        // Catálogos comerciais
        /\bcat[áa]logo\s+(comercial|de\s+vendas)\b/i,
        /\bfolheto\b/i, /\bflyer\b/i,
    ],
    medium: [
        // Linguagem de vendas
        /\beconomize\b/i, /\bmelhor\s+custo[\/-]benef[íi]cio\b/i,
        /\bgarantia\s+estendida\b/i,
        /\binstala[çc][ãa]o\s+gr[áa]tis\b/i,
        // Ausência de profundidade técnica
        /\bconforto\s+t[ée]rmico\b/i, /\bambiente\s+agrad[áa]vel\b/i,
        /\bdesign\s+(moderno|elegante)\b/i,
    ],
};

/**
 * Classifica o conteúdo de um documento convertido para MD
 * @param {string} markdownContent - Conteúdo em markdown do documento
 * @param {string} filename - Nome do arquivo original
 * @returns {object} Resultado da classificação
 */
export function classifyDocument(markdownContent, filename = '') {
    const content = markdownContent.toLowerCase();
    const lines = content.split('\n');

    let whitelistScore = 0;
    let blacklistScore = 0;
    const whitelistHits = [];
    const blacklistHits = [];

    // Analisar indicadores de whitelist
    for (const [weight, patterns] of Object.entries(WHITELIST_INDICATORS)) {
        const multiplier = weight === 'high' ? 3 : 1;
        for (const pattern of patterns) {
            const matches = content.match(new RegExp(pattern.source, 'gi'));
            if (matches) {
                whitelistScore += matches.length * multiplier;
                whitelistHits.push({
                    pattern: pattern.source,
                    weight,
                    count: matches.length,
                    sample: matches[0],
                });
            }
        }
    }

    // Analisar indicadores de blacklist
    for (const [weight, patterns] of Object.entries(BLACKLIST_INDICATORS)) {
        const multiplier = weight === 'high' ? 3 : 1;
        for (const pattern of patterns) {
            const matches = content.match(new RegExp(pattern.source, 'gi'));
            if (matches) {
                blacklistScore += matches.length * multiplier;
                blacklistHits.push({
                    pattern: pattern.source,
                    weight,
                    count: matches.length,
                    sample: matches[0],
                });
            }
        }
    }

    // Bônus: presença de tabelas técnicas (muitos pipes | em linhas)
    const tableLines = lines.filter(l => (l.match(/\|/g) || []).length >= 3).length;
    if (tableLines > 5) whitelistScore += tableLines;

    // Bônus: presença de diagramas ASCII
    const diagramLines = lines.filter(l => /[─│┌┐└┘├┤┬┴┼╔╗╚╝║═]/.test(l)).length;
    if (diagramLines > 3) whitelistScore += diagramLines * 2;

    // Calcular score normalizado
    const totalScore = whitelistScore + blacklistScore || 1;
    const normalizedWhitelist = whitelistScore / totalScore;
    const normalizedBlacklist = blacklistScore / totalScore;

    // Decisão
    let classification, reason;

    if (normalizedWhitelist >= 0.65) {
        classification = 'whitelist';
        reason = `Conteúdo técnico inverter confirmado (score: ${normalizedWhitelist.toFixed(2)}). ` +
            `${whitelistHits.length} indicadores técnicos encontrados.`;
    } else if (normalizedBlacklist >= 0.5) {
        classification = 'blacklist';
        reason = `Conteúdo convencional/marketing detectado (score: ${normalizedBlacklist.toFixed(2)}). ` +
            `${blacklistHits.length} indicadores de rejeição encontrados.`;
    } else if (whitelistScore > blacklistScore * 1.5) {
        classification = 'whitelist';
        reason = `Predominância técnica inverter (WL:${whitelistScore} vs BL:${blacklistScore}).`;
    } else if (blacklistScore > whitelistScore) {
        classification = 'blacklist';
        reason = `Predominância convencional/marketing (BL:${blacklistScore} vs WL:${whitelistScore}).`;
    } else {
        classification = 'review';
        reason = `Classificação ambígua (WL:${whitelistScore} vs BL:${blacklistScore}). Revisão manual recomendada.`;
    }

    return {
        classification,
        score: {
            whitelist: normalizedWhitelist,
            blacklist: normalizedBlacklist,
            raw: { whitelist: whitelistScore, blacklist: blacklistScore },
        },
        reason,
        indicators: {
            whitelist: whitelistHits.slice(0, 10),
            blacklist: blacklistHits.slice(0, 10),
        },
        stats: {
            totalLines: lines.length,
            tableLines,
            diagramLines,
        },
        filename,
        timestamp: new Date().toISOString(),
    };
}

// CLI mode
if (process.argv[2] === 'test' && process.argv[3]) {
    const filePath = process.argv[3];
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = classifyDocument(content, path.basename(filePath));

    const icon = result.classification === 'whitelist' ? '✅' :
        result.classification === 'blacklist' ? '🚫' : '⚠️';

    console.log(`\n${icon} Classificação: ${result.classification.toUpperCase()}`);
    console.log(`   Score WL: ${(result.score.whitelist * 100).toFixed(1)}% | BL: ${(result.score.blacklist * 100).toFixed(1)}%`);
    console.log(`   Razão: ${result.reason}`);
    console.log(`   Indicadores WL: ${result.indicators.whitelist.length} | BL: ${result.indicators.blacklist.length}`);

    if (result.indicators.whitelist.length > 0) {
        console.log('\n   Indicadores Whitelist:');
        result.indicators.whitelist.forEach(h =>
            console.log(`     [${h.weight}] "${h.sample}" (${h.count}x)`));
    }
    if (result.indicators.blacklist.length > 0) {
        console.log('\n   Indicadores Blacklist:');
        result.indicators.blacklist.forEach(h =>
            console.log(`     [${h.weight}] "${h.sample}" (${h.count}x)`));
    }
    console.log('');
}

export default { classifyDocument };
