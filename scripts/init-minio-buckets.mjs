import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    endpoint: 'http://127.0.0.1:9005',
    accessKeyId: 'admin',
    secretAccessKey: 'antigravity2026',
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

async function createBuckets() {
    const buckets = ['terraform-state', 'jarvis-memos', 'jarvis-artifacts'];
    for (const bucket of buckets) {
        try {
            await s3.createBucket({ Bucket: bucket }).promise();
            console.log(`✅ Bucket ${bucket} criado.`);
        } catch (err) {
            if (err.code === 'BucketAlreadyOwnedByYou') {
                console.log(`ℹ️ Bucket ${bucket} já existe.`);
            } else {
                console.error(`❌ Erro ao criar ${bucket}:`, err.message);
            }
        }
    }
}

createBuckets();
