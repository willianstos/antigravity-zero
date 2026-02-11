// FILE: playwright.config.js
module.exports = {
    use: {
        headless: true,
        launchOptions: {
            args: [
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--single-process',
                '--no-zygote',
                '--disable-accelerated-2d-canvas',
                '--disable-gl-drawing-for-tests',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding',
                '--disable-backgrounding-occluded-windows',
                '--disable-sync',
                '--disable-translate',
                '--disable-default-apps',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-first-run'
            ],
            timeout: 30000
        },
        navigationTimeout: 15000,
        actionTimeout: 10000,
        viewport: { width: 1280, height: 720 }
    },
    workers: 2
}
