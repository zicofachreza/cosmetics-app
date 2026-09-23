import { connectToDB } from '../lib/db'
import bcryptjs from 'bcryptjs'
import { z } from 'zod'
import { comparePassword, signToken } from '@/lib/auth'
import { LoginInput, NewUserInput } from '@/types/userType'

const RegisterValidation = z.object({
    name: z.string().nonempty('Name is required'),
    username: z.string().nonempty('Username is required'),
    email: z
        .string()
        .nonempty('Email is required')
        .email('Invalid email format'),
    password: z
        .string()
        .nonempty('Password is required')
        .min(5, 'Password must be at least 5 characters long'),
})

const LoginValidation = z.object({
    email: z
        .string()
        .nonempty('Email is required')
        .email('Invalid email format'),
    password: z.string().nonempty('Password is required'),
})

export default class UserModel {
    static async userCollection() {
        const db = await connectToDB()
        return db.collection('users')
    }

    static async findByEmail(email: string) {
        const collection = await this.userCollection()
        return collection.findOne({ email })
    }

    static async registerUser(newUser: NewUserInput) {
        RegisterValidation.parse(newUser)

        const collection = await this.userCollection()

        const existingUser = await collection.findOne({
            $or: [{ username: newUser.username }, { email: newUser.email }],
        })

        if (existingUser) {
            if (existingUser.username === newUser.username)
                throw new Error('Username already registered')
            if (existingUser.email === newUser.email)
                throw new Error('Email already registered')
        }

        const hashedPassword = await bcryptjs.hash(newUser.password, 10)
        const user = {
            ...newUser,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const result = await collection.insertOne(user)

        return { _id: result.insertedId, name: user.name, email: user.email }
    }

    static async loginUser(input: LoginInput) {
        LoginValidation.parse(input)

        const user = await this.findByEmail(input.email)
        if (!user) throw new Error('Invalid email / password')

        const isPasswordValid = comparePassword(input.password, user.password)
        if (!isPasswordValid) throw new Error('Invalid email / password')

        const token = signToken({
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
        })

        return token
    }
}
