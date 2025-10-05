import { getAllUsers, getUserById, createUser, updateUser, deleteUser, seedUsers, } from '../services/userService';
import { successResponse, errorResponse } from '../utils/response';
import { userSchema, updateUserSchema } from '../utils/validators';
import { z } from 'zod';
// Helper function to validate UUID
const validateUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};
// GET /users → Fetch all users
export const getUsers = async (c) => {
    try {
        const users = await getAllUsers();
        return successResponse(c, users, 'Fetched users successfully');
    }
    catch (err) {
        return errorResponse(c, 'FETCH_USERS_ERROR', 'Failed to fetch users', { error: err instanceof Error ? err.message : String(err) }, 500);
    }
};
// GET /users/:id → Fetch single user
export const getUser = async (c) => {
    const id = c.req.param('id');
    if (!validateUUID(id)) {
        return errorResponse(c, 'INVALID_USER_ID', 'Invalid user ID format', null, 400);
    }
    try {
        const user = await getUserById(id);
        if (!user) {
            return errorResponse(c, 'USER_NOT_FOUND', `User ${id} not found`, null, 404);
        }
        return successResponse(c, user, 'Fetched user successfully');
    }
    catch (err) {
        return errorResponse(c, 'FETCH_USER_ERROR', 'Failed to fetch user', { error: err instanceof Error ? err.message : String(err) }, 500);
    }
};
// POST /users → Create a new user
export const addUser = async (c) => {
    try {
        const body = await c.req.json().catch(() => ({}));
        // Validate input using Zod
        const validationResult = userSchema.safeParse(body);
        if (!validationResult.success) {
            return errorResponse(c, 'VALIDATION_ERROR', 'Invalid input data', { errors: validationResult.error.issues }, 400);
        }
        const newUser = await createUser(validationResult.data);
        return successResponse(c, newUser, 'User created successfully', 201);
    }
    catch (err) {
        return errorResponse(c, 'CREATE_USER_ERROR', 'Failed to create user', { error: err instanceof Error ? err.message : String(err) }, 500);
    }
};
// PUT /users/:id → Update an existing user
export const editUser = async (c) => {
    const id = c.req.param('id');
    if (!validateUUID(id)) {
        return errorResponse(c, 'INVALID_USER_ID', 'Invalid user ID format', null, 400);
    }
    try {
        const body = await c.req.json().catch(() => ({}));
        // Validate input using Zod
        const validationResult = updateUserSchema.safeParse(body);
        if (!validationResult.success) {
            return errorResponse(c, 'VALIDATION_ERROR', 'Invalid input data', { errors: validationResult.error.issues }, 400);
        }
        const updatedUser = await updateUser(id, validationResult.data);
        if (!updatedUser) {
            return errorResponse(c, 'USER_NOT_FOUND', `User ${id} not found`, null, 404);
        }
        return successResponse(c, updatedUser, 'User updated successfully');
    }
    catch (err) {
        return errorResponse(c, 'UPDATE_USER_ERROR', 'Failed to update user', { error: err instanceof Error ? err.message : String(err) }, 500);
    }
};
// DELETE /users/:id → Delete a user
export const removeUser = async (c) => {
    const id = c.req.param('id');
    if (!validateUUID(id)) {
        return errorResponse(c, 'INVALID_USER_ID', 'Invalid user ID format', null, 400);
    }
    try {
        const deleted = await deleteUser(id);
        if (!deleted) {
            return errorResponse(c, 'USER_NOT_FOUND', `User ${id} not found`, null, 404);
        }
        return successResponse(c, { id }, 'User deleted successfully');
    }
    catch (err) {
        return errorResponse(c, 'DELETE_USER_ERROR', 'Failed to delete user', { error: err instanceof Error ? err.message : String(err) }, 500);
    }
};
// POST /users/seed → Generate mock users
export const seedUserList = async (c) => {
    try {
        const body = await c.req.json().catch(() => ({}));
        // Validate seed count
        const seedSchema = z.object({ count: z.number().int().min(1).max(100).optional() });
        const validationResult = seedSchema.safeParse(body);
        if (!validationResult.success) {
            return errorResponse(c, 'VALIDATION_ERROR', 'Invalid seed data', { errors: validationResult.error.issues }, 400);
        }
        const { count = 5 } = validationResult.data;
        const seeded = await seedUsers(count);
        return successResponse(c, seeded, `Seeded ${count} users successfully`);
    }
    catch (err) {
        return errorResponse(c, 'SEED_USERS_ERROR', 'Failed to seed users', { error: err instanceof Error ? err.message : String(err) }, 500);
    }
};
