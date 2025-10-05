/**
 * API Key Authentication Middleware
 * Validates requests using API keys stored in environment variables
 */
export const apiKeyAuth = () => {
    return async (c, next) => {
        const apiKey = c.req.header('X-API-Key') || c.req.header('Authorization')?.replace('Bearer ', '');
        if (!apiKey) {
            return c.json({
                success: false,
                error: {
                    code: 'MISSING_API_KEY',
                    message: 'API key is required. Provide it in X-API-Key header or Authorization header as Bearer token.'
                },
                timestamp: new Date().toISOString()
            }, 401);
        }
        // Get valid API keys from environment (comma-separated)
        const validApiKeys = c.env?.API_KEYS?.split(',').map(key => key.trim()) || [];
        if (validApiKeys.length === 0) {
            return c.json({
                success: false,
                error: {
                    code: 'AUTH_CONFIG_ERROR',
                    message: 'Authentication not properly configured'
                },
                timestamp: new Date().toISOString()
            }, 500);
        }
        // Validate API key
        if (!validApiKeys.includes(apiKey)) {
            return c.json({
                success: false,
                error: {
                    code: 'INVALID_API_KEY',
                    message: 'Invalid API key provided'
                },
                timestamp: new Date().toISOString()
            }, 401);
        }
        await next();
    };
};
