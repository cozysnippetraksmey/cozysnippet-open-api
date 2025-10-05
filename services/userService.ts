import { User } from "../types/user"
import { generateUUID } from "../utils/uuid"
import { ConflictError } from "../utils/errorHandler"

// Mock in-memory DB
const users: User[] = []

// Helper: generate random user
const generateRandomUser = (): Omit<User, 'id'> => {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank']
    const name = names[Math.floor(Math.random() * names.length)]
    const email = `${name.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`
    const age = Math.floor(Math.random() * 40) + 18

    return { name, email, age }
}

// Service: Create new user
export const createUser = async (userData: Partial<User>): Promise<User> => {
    // Check for duplicate email
    if (userData.email && users.some(u => u.email === userData.email)) {
        throw new ConflictError('User with this email already exists')
    }

    const defaultData = generateRandomUser()
    const user: User = {
        id: generateUUID(),
        name: userData.name ?? defaultData.name,
        email: userData.email ?? defaultData.email,
        age: userData.age ?? defaultData.age,
    }

    users.push(user)
    return user
}

// Service: Get all users
export const getAllUsers = async (): Promise<User[]> => {
    return [...users] // Return a copy to prevent external mutations
}

// Service: Get single user
export const getUserById = async (id: string): Promise<User | null> => {
    return users.find((u) => u.id === id) ?? null
}

// Service: Update user
export const updateUser = async (
    id: string,
    updates: Partial<User>
): Promise<User | null> => {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return null

    // Check for duplicate email if email is being updated
    if (updates.email && updates.email !== users[index].email) {
        if (users.some(u => u.email === updates.email && u.id !== id)) {
            throw new ConflictError('User with this email already exists')
        }
    }

    users[index] = { ...users[index], ...updates, id } // Ensure ID cannot be changed
    return users[index]
}

// Service: Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return false

    users.splice(index, 1)
    return true
}

// Service: Seed random users
export const seedUsers = async (count: number = 5): Promise<User[]> => {
    const generated: User[] = []
    for (let i = 0; i < count; i++) {
        const userData = generateRandomUser()
        // Ensure unique emails for seeded users
        let attempts = 0
        while (users.some(u => u.email === userData.email) && attempts < 10) {
            userData.email = `${userData.name.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`
            attempts++
        }

        const user: User = {
            id: generateUUID(),
            ...userData
        }
        users.push(user)
        generated.push(user)
    }
    return generated
}
