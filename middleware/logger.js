export const logger = async (c, next) => {
    const start = Date.now();
    await next(); // run the next middleware / handler
    const duration = Date.now() - start;
    console.log(`${c.req.method} ${c.req.url} -> ${c.res.status} (${duration}ms)`);
};
