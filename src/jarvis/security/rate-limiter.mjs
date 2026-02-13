#!/usr/bin/env node
// ================================================
// ⏱️ RATE LIMITER — Token Bucket Algorithm
// Protects Jarvis API from abuse
// ================================================

class RateLimiter {
    constructor({ maxTokens = 30, refillRate = 1, windowMs = 60000 } = {}) {
        this.maxTokens = maxTokens;       // Max requests per window
        this.refillRate = refillRate;      // Tokens added per second
        this.windowMs = windowMs;         // Window in ms
        this.buckets = new Map();         // IP/user -> bucket
    }

    // Check if request is allowed
    allow(key = 'default') {
        const now = Date.now();
        let bucket = this.buckets.get(key);

        if (!bucket) {
            bucket = { tokens: this.maxTokens, lastRefill: now };
            this.buckets.set(key, bucket);
        }

        // Refill tokens
        const elapsed = (now - bucket.lastRefill) / 1000;
        bucket.tokens = Math.min(this.maxTokens, bucket.tokens + elapsed * this.refillRate);
        bucket.lastRefill = now;

        if (bucket.tokens >= 1) {
            bucket.tokens -= 1;
            return { allowed: true, remaining: Math.floor(bucket.tokens), resetMs: Math.floor((this.maxTokens - bucket.tokens) / this.refillRate * 1000) };
        }

        return { allowed: false, remaining: 0, retryAfterMs: Math.floor((1 - bucket.tokens) / this.refillRate * 1000) };
    }

    // Express/http middleware
    middleware(keyFn = (req) => req.socket?.remoteAddress || 'unknown') {
        return (req, res, next) => {
            const key = keyFn(req);
            const result = this.allow(key);

            res.setHeader('X-RateLimit-Limit', this.maxTokens);
            res.setHeader('X-RateLimit-Remaining', result.remaining);

            if (!result.allowed) {
                res.setHeader('Retry-After', Math.ceil(result.retryAfterMs / 1000));
                res.writeHead(429, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Too Many Requests',
                    retryAfterMs: result.retryAfterMs,
                    limit: this.maxTokens
                }));
                return;
            }

            if (typeof next === 'function') next();
            return true;
        };
    }

    // Cleanup old buckets (call periodically)
    cleanup(maxAgeMs = 300000) {
        const now = Date.now();
        for (const [key, bucket] of this.buckets) {
            if (now - bucket.lastRefill > maxAgeMs) this.buckets.delete(key);
        }
    }
}

// Pre-configured limiters
export const apiLimiter = new RateLimiter({ maxTokens: 30, refillRate: 1 });   // 30 req/min
export const executeLimiter = new RateLimiter({ maxTokens: 10, refillRate: 0.5 }); // 10 req/min (costly)
export const telegramLimiter = new RateLimiter({ maxTokens: 20, refillRate: 0.5 }); // 20 req/min

export default RateLimiter;
