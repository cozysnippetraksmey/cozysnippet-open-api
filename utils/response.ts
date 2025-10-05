import type { Context } from 'hono'

export const successResponse = (c: Context, data: unknown, message?: string, status: number = 200) => {
    return c.json({
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    }, status as any)
}

export const errorResponse = (
    c: Context,
    code: string,
    message: string,
    details?: unknown,
    status: number = 400
) => {
    return c.json(
        {
            success: false,
            error: {
                code,
                message,
                details,
            },
            timestamp: new Date().toISOString(),
        },
        status as any
    )
}
