import UserModel from '@/models/user'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const { email, password } = body

        const token = await UserModel.loginUser({ email, password })
        return NextResponse.json({ accessToken: token }, { status: 200 })
    } catch (error) {
        if (error instanceof ZodError) {
            const { message } = error.issues[0]

            return NextResponse.json({ message: `${message}` }, { status: 400 })
        }

        if (
            error instanceof Error &&
            error.message === 'Invalid email / password'
        ) {
            return NextResponse.json(
                { message: 'Invalid email / password' },
                { status: 401 }
            )
        }
        
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
