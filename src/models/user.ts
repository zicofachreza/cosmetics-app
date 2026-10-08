import { connectToDB } from '../lib/db'
import bcryptjs from 'bcryptjs'
import { comparePassword, signToken } from '@/lib/auth'
import { LoginInput, NewUserInput } from '@/types/userType'

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
        const collection = await this.userCollection()

        const existingUser = await collection.findOne({
            $or: [
                {
                    email: newUser.email,
                },
            ],
        })

        if (existingUser) {
            if (existingUser.email === newUser.email) {
                throw new Error('Alamat email sudah terdaftar')
            }
        }

        const hashedPassword = await bcryptjs.hash(
            newUser.password,
            10
        )

        const user = {
            ...newUser,

            password: hashedPassword,

            role: 'user' as const,

            createdAt: new Date(),

            updatedAt: new Date(),
        }

        const result = await collection.insertOne(user)

        return {
            _id: result.insertedId,
            name: user.name,
            email: user.email,
        }
    }

    static async loginUser(input: LoginInput) {
        const user = await this.findByEmail(input.email)

        if (!user) {
            throw new Error('Email / password salah')
        }

        const isPasswordValid = comparePassword(
            input.password,
            user.password
        )

        if (!isPasswordValid) {
            throw new Error('Email / password salah')
        }

        const token = signToken({
            _id: user._id.toString(),

            email: user.email,

            name: user.name,

            role: user.role || 'user',
        })

        return token
    }

    static async findOrCreateGoogleUser(data: {
        googleId: string
        email: string
        name: string
    }) {
        const collection = await this.userCollection()

        /*
         * 1. Cari user berdasarkan email
         */
        let user = await collection.findOne({
            email: data.email,
        })

        /*
         * 2. Kalau user sudah ada
         */
        if (user) {
            /*
             * Kalau belum punya googleId,
             * hubungkan account Google ke account existing.
             */
            if (!user.googleId) {
                await collection.updateOne(
                    {
                        _id: user._id,
                    },
                    {
                        $set: {
                            googleId: data.googleId,
                            updatedAt: new Date(),
                        },
                    }
                )

                user.googleId = data.googleId
            }

            return signToken({
                _id: user._id.toString(),

                email: user.email,

                name: user.name,

                role: user.role || 'user',
            })
        }

        /*
         * 3. Google account tidak membutuhkan
         * password lokal.
         *
         * Kita tetap simpan placeholder karena
         * schema user kamu sekarang membutuhkan password.
         */
        const randomPassword = await bcryptjs.hash(
            crypto.randomUUID(),
            10
        )

        /*
         * 5. Create user baru
         */
        const newUser = {
            name: data.name,

            email: data.email,

            password: randomPassword,

            googleId: data.googleId,

            role: 'user' as const,

            createdAt: new Date(),

            updatedAt: new Date(),
        }

        const result = await collection.insertOne(newUser)

        /*
         * 6. Generate JWT dengan format
         * yang sama dengan login biasa.
         */
        return signToken({
            _id: result.insertedId.toString(),

            email: newUser.email,

            name: newUser.name,

            role: newUser.role,
        })
    }
}