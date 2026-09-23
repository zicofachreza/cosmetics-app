'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginSchema } from '@/schemas/loginSchema'

export async function handleLogin(data: {
    email: string
    password: string
}) {
    const parsed = loginSchema.safeParse(data)

    if (!parsed.success) {
        return {
            error: parsed.error.issues[0]?.message,
        }
    }

    const response = await fetch(
        `/api/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsed.data),
        },
    )

    const result = await response.json()

    if (!response.ok) {
        return {
            error: result.message,
        }
    }

    const cookieStore = await cookies()

    cookieStore.set('Authorization', `Bearer ${result.accessToken}`, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    })

    redirect('/')
}