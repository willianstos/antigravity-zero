import { spawnSync } from 'child_process';
import { existsSync } from 'fs';

/**
 * 👁️ VISION CORTEX - OCR Engine
 * Extrai texto de screenshots usando Tesseract OCR.
 */
export class OCREngine {
    async extract(imagePath) {
        if (!existsSync(imagePath)) {
            throw new Error(`Imagem não encontrada: ${imagePath}`);
        }

        console.log(`👁️ [VISION] Executando OCR em: ${imagePath}...`);

        // Executa tesseract enviando o resultado para stdout (-)
        const proc = spawnSync('tesseract', [imagePath, 'stdout', '-l', 'por+eng'], { encoding: 'utf8' });

        if (proc.status !== 0) {
            throw new Error(`Erro no Tesseract: ${proc.stderr}`);
        }

        return {
            text: proc.stdout.trim(),
            timestamp: new Date().toISOString()
        };
    }
}
