import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '../../../../');
const envPath = path.join(rootDir, '.env');

// Parse arguments
const args = process.argv.slice(2);
const queryIndex = args.indexOf('--query');
const isDeep = args.includes('--deep');
const query = queryIndex !== -1 ? args[queryIndex + 1] : null;

if (!query) {
    console.error('Error: --query is required');
    process.exit(1);
}

// Simple .env parser
const env = {};
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim().replace(/^["'](.+)["']$/, '$1');
            env[key] = value;
        }
    });
}

const API_KEY = env.PERPLEXITY_API_KEY;

if (!API_KEY || API_KEY === '{chave}') {
    console.error('Error: PERPLEXITY_API_KEY not found or not set in .env');
    process.exit(1);
}

async function run() {
    console.log(`🚀 Perplexity API Search: "${query}" (Deep: ${isDeep})`);

    const model = isDeep ? "sonar-reasoning-pro" : "sonar";
    
    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: 'Be precise and concise. Answer in Portuguese (PT-BR) as you are the technical assistant Jarvis.' },
                    { role: 'user', content: query }
                ],
                temperature: 0.2,
                top_p: 0.9,
                return_images: false,
                return_related_questions: false,
                search_domain_filter: null,
                intent_decrement_radius: 1,
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const result = data.choices[0].message.content;

        console.log('\n--- RESEARCH RESULT ---\n');
        console.log(result);
        console.log('\n--- END OF RESULT ---\n');

        // Save result metadata for artifacts if needed
        const timestamp = new Date().getTime();
        const resultPath = path.join(rootDir, `artifacts/perplexity-api-result-${timestamp}.json`);
        fs.writeFileSync(resultPath, JSON.stringify(data, null, 2));
        console.log(`Raw API response saved to ${resultPath}`);

    } catch (error) {
        console.error('An error occurred during Perplexity API research:', error);
        process.exit(1);
    }
}

run();
