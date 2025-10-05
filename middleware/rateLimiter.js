// Simple in-memory rate limiter (for production, use Redis or similar)
const requestCounts = new Map();
export const rateLimiter = (options) => {
    return async (c, next) => {
        const clientIp = c.req.header('cf-connecting-ip') ||
            c.req.header('x-forwarded-for') ||
            'unknown';
        const now = Date.now();
        const windowStart = now - options.windowMs;
        // Clean up old entries
        for (const [ip, data] of requestCounts.entries()) {
            if (data.resetTime < now) {
                requestCounts.delete(ip);
            }
        }
        const clientData = requestCounts.get(clientIp);
        if (!clientData || clientData.resetTime < now) {
            // First request or window expired
            requestCounts.set(clientIp, {
                count: 1,
                resetTime: now + options.windowMs
            });
        }
        else {
            // Within window
            clientData.count++;
            if (clientData.count > options.maxRequests) {
                return c.json({
                    success: false,
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: options.message || 'Too many requests',
                    },
                }, 429);
            }
        }
        // Add rate limit headers
        c.res.headers.set('X-RateLimit-Limit', options.maxRequests.toString());
        c.res.headers.set('X-RateLimit-Remaining', Math.max(0, options.maxRequests - (clientData?.count || 1)).toString());
        c.res.headers.set('X-RateLimit-Reset', new Date(requestCounts.get(clientIp)?.resetTime || now).toISOString());
        await next();
    };
};
