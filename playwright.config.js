// FILE: playwright.config.js
module.exports = {
    // Global timeouts
    timeout: 60000,
    expect: {
        timeout: 5000
    },

    // Limit workers to avoid memory overload
    workers: 2,

    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,

        // Interaction timeouts
        actionTimeout: 10000,
        navigationTimeout: 15000,

        launchOptions: {
            channel: 'chrome', // Added channel property
            // Optimized browser arguments for headless automation
            args: [
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--single-process', // Low memory footprint, experimental
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
                '--no-first-run',
                '--disable-extensions',
                '--disable-component-extensions-with-background-pages'
            ],
            // Remove automation flags to be less detectable and slightly faster
            ignoreDefaultArgs: ['--enable-automation'],
            timeout: 30000
        }
    },

    // Explicit project definition
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
};
