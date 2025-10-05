import { z } from '@hono/zod-openapi';
// User schemas for OpenAPI documentation
export const UserSchema = z.object({
    id: z.string().uuid().openapi({
        description: 'Unique identifier for the user',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    name: z.string().min(1).max(100).openapi({
        description: 'Full name of the user',
        example: 'John Doe'
    }),
    email: z.string().email().openapi({
        description: 'Email address of the user',
        example: 'john.doe@example.com'
    }),
    age: z.number().int().min(1).max(120).openapi({
        description: 'Age of the user in years',
        example: 25
    })
}).openapi('User');
export const CreateUserSchema = z.object({
    name: z.string().min(1).max(100).openapi({
        description: 'Full name of the user',
        example: 'John Doe'
    }),
    email: z.string().email().openapi({
        description: 'Email address of the user',
        example: 'john.doe@example.com'
    }),
    age: z.number().int().min(1).max(120).openapi({
        description: 'Age of the user in years',
        example: 25
    })
}).openapi('CreateUser');
export const UpdateUserSchema = z.object({
    name: z.string().min(1).max(100).optional().openapi({
        description: 'Full name of the user',
        example: 'John Doe'
    }),
    email: z.string().email().optional().openapi({
        description: 'Email address of the user',
        example: 'john.doe@example.com'
    }),
    age: z.number().int().min(1).max(120).optional().openapi({
        description: 'Age of the user in years',
        example: 25
    })
}).openapi('UpdateUser');
// Common response schemas
export const SuccessResponseSchema = z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: 'Operation completed successfully' }),
    data: z.any().openapi({ description: 'Response data' })
}).openapi('SuccessResponse');
export const ErrorResponseSchema = z.object({
    success: z.boolean().openapi({ example: false }),
    error: z.object({
        code: z.string().openapi({ example: 'ERROR_CODE' }),
        message: z.string().openapi({ example: 'Error description' })
    })
}).openapi('ErrorResponse');
// Pagination schema
export const PaginationSchema = z.object({
    page: z.number().int().min(1).optional().openapi({
        description: 'Page number',
        example: 1
    }),
    limit: z.number().int().min(1).max(100).optional().openapi({
        description: 'Number of items per page',
        example: 10
    })
}).openapi('Pagination');
// Admin schemas
export const GenerateKeysRequestSchema = z.object({
    count: z.number().int().min(1).max(10).optional().openapi({
        description: 'Number of API keys to generate (1-10)',
        example: 3
    })
}).openapi('GenerateKeysRequest');
export const ApiKeyInfoSchema = z.object({
    totalKeys: z.number().int().openapi({
        description: 'Total number of configured API keys',
        example: 3
    }),
    keyPrefixes: z.array(z.string()).openapi({
        description: 'Array of key prefixes for identification',
        example: ['cz_VpPT9...', 'cz_kL8Mn...']
    }),
    configured: z.boolean().openapi({
        description: 'Whether API keys are properly configured',
        example: true
    }),
    lastUpdated: z.string().openapi({
        description: 'ISO timestamp of last update',
        example: '2025-10-04T12:00:00.000Z'
    })
}).openapi('ApiKeyInfo');
export const GeneratedKeysSchema = z.object({
    keys: z.array(z.string()).openapi({
        description: 'Array of generated API keys',
        example: ['cz_abc123...', 'cz_def456...']
    }),
    count: z.number().int().openapi({
        description: 'Number of keys generated',
        example: 2
    }),
    instructions: z.object({
        setup: z.string().openapi({ example: 'wrangler secret put API_KEYS' }),
        value: z.string().openapi({ example: 'cz_abc123...,cz_def456...' }),
        usage: z.string().openapi({ example: 'Include one of these keys in X-API-Key header' })
    }).openapi({ description: 'Setup and usage instructions' })
}).openapi('GeneratedKeys');
