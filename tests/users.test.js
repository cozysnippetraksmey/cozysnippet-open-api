import { describe, it, expect, beforeEach } from 'vitest';
import { testClient } from 'hono/testing';
import { Hono } from 'hono';
import usersRoute from '../routes/users';
// Create a test app
const app = new Hono();
app.route('/api/v1/users', usersRoute);
const client = testClient(app);
describe('Users API', () => {
    beforeEach(() => {
        // Clear users before each test
        // Note: In a real app, you'd reset your database/storage
    });
    describe('GET /api/v1/users', () => {
        it('should return empty array initially', async () => {
            // @ts-ignore
            const res = await client.api.v1.users.$get();
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.success).toBe(true);
            expect(data.data).toEqual([]);
        });
    });
    describe('POST /api/v1/users', () => {
        it('should create a user with valid data', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 25
            };
            // @ts-ignore
            const res = await client.api.v1.users.$post({
                json: userData
            });
            expect(res.status).toBe(201);
            const data = await res.json();
            expect(data.success).toBe(true);
            expect(data.data).toMatchObject(userData);
            expect(data.data.id).toBeDefined();
        });
        it('should reject invalid email', async () => {
            const userData = {
                name: 'John Doe',
                email: 'invalid-email',
                age: 25
            };
            // @ts-ignore
            const res = await client.api.v1.users.$post({
                json: userData
            });
            expect(res.status).toBe(400);
        });
        it('should reject age under 18', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 16
            };
            // @ts-ignore
            const res = await client.api.v1.users.$post({
                json: userData
            });
            expect(res.status).toBe(400);
        });
    });
});
