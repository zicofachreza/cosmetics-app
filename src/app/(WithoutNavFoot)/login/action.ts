'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginSchema } from '@/schemas/loginSchema'
import UserModel from '@/models/user'

export async function handleLogin(data: { email: string; password: string }) {
    const parsed = loginSchema.safeParse(data)

    if (!parsed.success) {
        return {
            error: parsed.error.issues[0]?.message,
        }
    }

    try {
        const accessToken = await UserModel.loginUser(parsed.data)

        const cookieStore = await cookies()

        cookieStore.set('Authorization', `Bearer ${accessToken}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        })
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === 'Invalid email / password'
        ) {
            return {
                error: 'Invalid email / password',
            }
        }

        console.error('Login error:', error)

        return {
            error: 'Internal server error',
        }
    }

    redirect('/')
}
