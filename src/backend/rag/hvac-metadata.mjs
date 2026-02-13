export class HVACMetadataExtractor {
    constructor() {
        this.patterns = {
            btu: [
                /\b(\d{1,2})[\s\.\-,]*000\s*(?:btu|kcal)/gi, // 9000 -> ["9", "000"]
                /\b(\d{1,2})k\s*(?:btu|kcal)/gi, // 9k -> 9
            ],
            voltage: [
                /(\b220[\s\-\/]*240\s*v)|(\b220\s*v)|(\b127\s*v)|(\b110\s*v)|(\b380\s*v)/gi,
            ],
            gas: [
                /(R-?410[Aa])/gi,
                /(R-?32)/gi,
                /(R-?22)/gi,
            ],
            type: {
                residential: [
                    /residencial/i,
                    /split hi[- ]?wall/i,
                    /piso[\/-]?teto/i,
                    /cassette/i,
                ],
                commercial: [
                    /comercial/i,
                    /vrf/i,
                    /vrv/i,
                    /chiller/i,
                    /multi[\s\-]v/i,
                ],
            },
        };
    }

    detectBTU(text) {
        for (const regex of this.patterns.btu) {
            const match = text.matchAll(regex);
            for (const m of match) {
                let val = parseInt(m[1], 10);
                if (regex.source.includes("k")) val *= 1000;
                else val *= 1000; // 9 -> 9000

                if (val > 5000 && val < 100000) return val; // Filtro de sanidade
            }
        }
        return null;
    }

    detectVoltage(text) {
        const voltages = [];
        if (this.patterns.voltage[0].test(text)) { // 220
            // Tenta ser específico primeiro
            const match = text.match(this.patterns.voltage[0]);
            if (match) return match[0].replace(/\s/g, '').toUpperCase();
        }
        // Simplificado pro MVP
        if (/220/.test(text)) return "220V";
        if (/127/.test(text) || /110/.test(text)) return "127V";
        if (/380/.test(text)) return "380V";
        return null; // Tensão indefinida ou bivolt complexo
    }

    detectGas(text) {
        for (const regex of this.patterns.gas) {
            const match = text.match(regex);
            if (match) return match[0].toUpperCase().replace("-", ""); // R410A
        }
        return null;
    }

    detectType(text) {
        for (const regex of this.patterns.type.commercial) {
            if (regex.test(text)) return "commercial";
        }
        for (const regex of this.patterns.type.residential) {
            if (regex.test(text)) return "residential";
        }
        return "unknown"; // Default
    }

    extract(markdown) {
        // Pega os primeiros 2000 caracteres (cabeçalho/specs geralmente no início)
        // e os últimos 1000 (tabelas técnicas as vezes no final)
        const sample = markdown.slice(0, 3000) + "\n" + markdown.slice(-1500);

        return {
            capacity_btu: this.detectBTU(sample),
            voltage: this.detectVoltage(sample),
            refrigerant: this.detectGas(sample),
            market_segment: this.detectType(sample),
        };
    }
}

// Teste rápido (só roda se chamado direto)
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const extractor = new HVACMetadataExtractor();
    const sampleText = `
    Manual de Serviço
    Split Hi-Wall Inverter Midea
    Capacidade: 12.000 BTU/h
    Tensão: 220V / 60Hz
    Gás Refrigerante: R-410A
    Tecnologia Inverter Quattro
  `;
    console.log("Teste de Extração:", extractor.extract(sampleText));
}
