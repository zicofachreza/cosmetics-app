'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { loginSchema } from '@/schemas/loginSchema'
import UserModel from '@/models/user'

export async function handleLogin(
    data: {
        email: string
        password: string
    }
) {
    const parsed =
        loginSchema.safeParse(data)

    if (!parsed.success) {
        return {
            error:
                parsed.error.issues[0]
                    ?.message,
        }
    }

    try {
        const accessToken =
            await UserModel.loginUser(
                parsed.data
            )

        const cookieStore =
            await cookies()

        cookieStore.set(
            'Authorization',
            `Bearer ${accessToken}`,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    'production',

                sameSite: 'strict',

                path: '/',

                maxAge: 60 * 60 * 24,
            }
        )
    } catch (error) {
        if (
            error instanceof Error &&
            error.message ===
                'Email / password salah'
        ) {
            return {
                error:
                    'Email / password salah',
            }
        }

        console.error(
            'Login error:',
            error
        )

        return {
            error:
                'Kesalahan server internal',
        }
    }

    redirect('/')
}