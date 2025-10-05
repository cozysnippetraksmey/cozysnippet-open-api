import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { UserSchema, CreateUserSchema, UpdateUserSchema, ErrorResponseSchema } from '../schemas/openapi';
import { getUsers, getUser, addUser, editUser, removeUser, seedUserList, } from '../controllers/usersController';
const users = new OpenAPIHono();
// GET /users - Get all users
const getUsersRoute = createRoute({
    method: 'get',
    path: '/',
    tags: ['Users'],
    summary: 'Get all users',
    description: 'Retrieve a list of all users in the system. Requires API key authentication.',
    security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
    responses: {
        200: {
            description: 'List of users retrieved successfully',
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        message: z.string(),
                        data: z.array(UserSchema)
                    })
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid or missing API key',
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
// GET /users/:id - Get user by ID
const getUserRoute = createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Users'],
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their unique identifier. Requires API key authentication.',
    security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().uuid().openapi({
                description: 'User ID (UUID format)',
                example: '550e8400-e29b-41d4-a716-446655440000'
            })
        })
    },
    responses: {
        200: {
            description: 'User retrieved successfully',
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        message: z.string(),
                        data: UserSchema
                    })
                }
            }
        },
        400: {
            description: 'Bad request - Invalid user ID format',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        },
        404: {
            description: 'User not found',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid or missing API key',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        }
    }
});
// POST /users - Create new user
const createUserRoute = createRoute({
    method: 'post',
    path: '/',
    tags: ['Users'],
    summary: 'Create new user',
    description: 'Create a new user in the system. Requires API key authentication.',
    security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
    request: {
        body: {
            description: 'User data to create',
            content: {
                'application/json': {
                    schema: CreateUserSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: 'User created successfully',
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        message: z.string(),
                        data: UserSchema
                    })
                }
            }
        },
        400: {
            description: 'Bad request - Invalid input data',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid or missing API key',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        }
    }
});
// PUT /users/:id - Update user
const updateUserRoute = createRoute({
    method: 'put',
    path: '/{id}',
    tags: ['Users'],
    summary: 'Update user',
    description: 'Update an existing user by their ID. Requires API key authentication.',
    security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().uuid().openapi({
                description: 'User ID (UUID format)',
                example: '550e8400-e29b-41d4-a716-446655440000'
            })
        }),
        body: {
            description: 'User data to update',
            content: {
                'application/json': {
                    schema: UpdateUserSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: 'User updated successfully',
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        message: z.string(),
                        data: UserSchema
                    })
                }
            }
        },
        400: {
            description: 'Bad request - Invalid input data',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        },
        404: {
            description: 'User not found',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid or missing API key',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        }
    }
});
// DELETE /users/:id - Delete user
const deleteUserRoute = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Users'],
    summary: 'Delete user',
    description: 'Delete a user by their ID. Requires API key authentication.',
    security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().uuid().openapi({
                description: 'User ID (UUID format)',
                example: '550e8400-e29b-41d4-a716-446655440000'
            })
        })
    },
    responses: {
        200: {
            description: 'User deleted successfully',
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        message: z.string(),
                        data: z.null()
                    })
                }
            }
        },
        400: {
            description: 'Bad request - Invalid user ID format',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        },
        404: {
            description: 'User not found',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid or missing API key',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        }
    }
});
// POST /users/seed - Seed users
const seedUsersRoute = createRoute({
    method: 'post',
    path: '/seed',
    tags: ['Users'],
    summary: 'Seed sample users',
    description: 'Create sample users for testing purposes. Requires API key authentication.',
    security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
    responses: {
        201: {
            description: 'Sample users created successfully',
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        message: z.string(),
                        data: z.array(UserSchema)
                    })
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid or missing API key',
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            }
        }
    }
});
// Register routes with OpenAPI documentation
users.openapi(getUsersRoute, getUsers);
users.openapi(getUserRoute, getUser);
users.openapi(createUserRoute, addUser);
users.openapi(updateUserRoute, editUser);
users.openapi(deleteUserRoute, removeUser);
users.openapi(seedUsersRoute, seedUserList);
export default users;
