/**
 * Admin Authentication Middleware
 * Protects admin endpoints with a master secret
 */
export const adminAuth = () => {
    return async (c, next) => {
        const adminSecret = c.req.header('X-Admin-Secret') || c.req.header('Authorization')?.replace('Bearer ', '');
        if (!adminSecret) {
            return c.json({
                success: false,
                error: {
                    code: 'MISSING_ADMIN_SECRET',
                    message: 'Admin secret is required. Provide it in X-Admin-Secret header or Authorization header.'
                },
                timestamp: new Date().toISOString()
            }, 401);
        }
        // Get admin secret from environment
        const validAdminSecret = c.env?.ADMIN_SECRET;
        if (!validAdminSecret) {
            return c.json({
                success: false,
                error: {
                    code: 'ADMIN_CONFIG_ERROR',
                    message: 'Admin authentication not properly configured'
                },
                timestamp: new Date().toISOString()
            }, 500);
        }
        // Validate admin secret
        if (adminSecret !== validAdminSecret) {
            return c.json({
                success: false,
                error: {
                    code: 'INVALID_ADMIN_SECRET',
                    message: 'Invalid admin secret provided'
                },
                timestamp: new Date().toISOString()
            }, 401);
        }
        await next();
    };
};
