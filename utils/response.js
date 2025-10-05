export const successResponse = (c, data, message, status = 200) => {
    return c.json({
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    }, status);
};
export const errorResponse = (c, code, message, details, status = 400) => {
    return c.json({
        success: false,
        error: {
            code,
            message,
            details,
        },
        timestamp: new Date().toISOString(),
    }, status);
};
