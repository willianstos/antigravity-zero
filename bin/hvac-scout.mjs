import fs from 'fs';
import https from 'https';
import path from 'path';
import { execSync } from 'child_process';

const DOWNLOAD_DIR = '/data/manuals/';
const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} SCOUT "${escapedMsg}"`);
    } catch (e) { console.log(e.message); }
}

function downloadFile(url, fileName) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(DOWNLOAD_DIR, fileName);
        logIAM(`🔭 Iniciando download direto: ${url}`);
        
        const file = fs.createWriteStream(filePath);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                logIAM(`↪️ Redirecionando para: ${response.headers.location}`);
                downloadFile(response.headers.location, fileName).then(resolve).catch(reject);
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                logIAM(`✅ Sucesso: Manual salvo em ${filePath}`);
                resolve(filePath);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            logIAM(`❌ Erro no download: ${err.message}`);
            reject(err);
        });
    });
}

const [,, url, name] = process.argv;
if (url && name) {
    downloadFile(url, name);
} else {
    // Default Daikin Test
    downloadFile('https://daikincomfort.com/docs/default-source/vrv-iv-heat-pump/sm-hp-sius341615e--final.pdf', 'daikin_vrv_iv_service.pdf');
}
