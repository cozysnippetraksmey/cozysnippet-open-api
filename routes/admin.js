import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { GenerateKeysRequestSchema, ApiKeyInfoSchema, GeneratedKeysSchema, ErrorResponseSchema } from '../schemas/openapi';
const adminRoute = new OpenAPIHono();
/**
 * Generate a secure API key
 */
function generateApiKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'cz_';
    for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
// POST /admin/keys/generate - Generate new API keys
const generateKeysRoute = createRoute({
    method: 'post',
    path: '/keys/generate',
    tags: ['Admin'],
    summary: 'Generate new API keys',
    description: 'Generate new API keys for client authentication. Requires admin secret.',
    security: [{ AdminAuth: [] }],
    request: {
        body: {
            description: 'Key generation parameters',
            content: {
                'application/json': {
                    schema: GenerateKeysRequestSchema
                }
            },
            required: false
        }
    },
    responses: {
        200: {
            description: 'API keys generated successfully',
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        data: GeneratedKeysSchema
                    })
                }
            }
        },
        400: {
            description: 'Bad request - Invalid parameters',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid or missing admin secret',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        }
    }
});
// GET /admin/keys/info - Get API keys info
const getKeysInfoRoute = createRoute({
    method: 'get',
    path: '/keys/info',
    tags: ['Admin'],
    summary: 'Get API keys information',
    description: 'Retrieve information about currently configured API keys (without revealing actual keys). Requires admin secret.',
    security: [{ AdminAuth: [] }],
    responses: {
        200: {
            description: 'API keys information retrieved successfully',
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        data: ApiKeyInfoSchema
                    })
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid or missing admin secret',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        },
        500: {
            description: 'Internal server error',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        }
    }
});
// GET /admin/health - Admin health check
const adminHealthRoute = createRoute({
    method: 'get',
    path: '/health',
    tags: ['Admin'],
    summary: 'Admin system health check',
    description: 'Check the health status of the admin key management system. Requires admin secret.',
    security: [{ AdminAuth: [] }],
    responses: {
        200: {
            description: 'Admin system is healthy',
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        data: z.object({
                            status: z.string().openapi({ example: 'admin_healthy' }),
                            timestamp: z.string().openapi({ example: '2025-10-04T12:00:00.000Z' }),
                            features: z.array(z.string()).openapi({ example: ['key_generation', 'key_info'] })
                        })
                    })
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid or missing admin secret',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        }
    }
});
// Generate new API keys handler
const generateKeysHandler = async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const count = Math.min(body.count || 1, 10); // Limit to 10 keys max
    const keys = [];
    for (let i = 0; i < count; i++) {
        keys.push(generateApiKey());
    }
    return c.json({
        success: true,
        data: {
            keys,
            count: keys.length,
            instructions: {
                setup: "wrangler secret put API_KEYS",
                value: keys.join(','),
                usage: "Include one of these keys in X-API-Key header or Authorization: Bearer header"
            }
        }
    });
};
// Get API keys info handler
const getKeysInfoHandler = async (c) => {
    const apiKeys = c.env?.API_KEYS?.split(',').map((key) => key.trim()) || [];
    return c.json({
        success: true,
        data: {
            totalKeys: apiKeys.length,
            keyPrefixes: apiKeys.map((key) => key.substring(0, 8) + '...'),
            configured: apiKeys.length > 0,
            lastUpdated: new Date().toISOString()
        }
    });
};
// Admin health check handler
const adminHealthHandler = (c) => {
    return c.json({
        success: true,
        data: {
            status: 'admin_healthy',
            timestamp: new Date().toISOString(),
            features: ['key_generation', 'key_info']
        }
    });
};
// Register routes with OpenAPI documentation
adminRoute.openapi(generateKeysRoute, generateKeysHandler);
adminRoute.openapi(getKeysInfoRoute, getKeysInfoHandler);
adminRoute.openapi(adminHealthRoute, adminHealthHandler);
export default adminRoute;
