import type { Context } from 'hono'
import { errorResponse } from './response'

// Custom error classes for better error handling
export class ValidationError extends Error {
    constructor(message: string, public field?: string) {
        super(message)
        this.name = 'ValidationError'
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NotFoundError'
    }
}

export class ConflictError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ConflictError'
    }
}

export const globalErrorHandler = (err: unknown, c: Context) => {
    console.error('Error:', err)

    // Handle HTTPException from Hono (like authentication errors)
    if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
        // This is likely an HTTPException from auth middleware
        try {
            const errorData = JSON.parse(String(err.message))
            return c.json(errorData, (err as any).status)
        } catch {
            // If it's not JSON, handle as regular error
        }
    }

    // Handle different error types
    if (err instanceof ValidationError) {
        return errorResponse(
            c,
            'VALIDATION_ERROR',
            err.message,
            { field: err.field },
            400
        )
    }

    if (err instanceof NotFoundError) {
        return errorResponse(
            c,
            'NOT_FOUND',
            err.message,
            null,
            404
        )
    }

    if (err instanceof ConflictError) {
        return errorResponse(
            c,
            'CONFLICT',
            err.message,
            null,
            409
        )
    }

    // Default error handling - no more process.env usage
    return errorResponse(
        c,
        'INTERNAL_SERVER_ERROR',
        'An unexpected error occurred',
        null, // Don't expose internal error details in production
        500
    )
}
