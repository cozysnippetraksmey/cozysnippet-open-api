import { z } from 'zod';
// User schema for validation
export const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.email('Invalid email address'),
    age: z.number().int().min(18, 'Age must be at least 18'),
});
// Partial schema for updates (all fields optional)
export const updateUserSchema = userSchema.partial();
