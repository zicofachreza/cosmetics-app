export const runtime = "nodejs"

import UserModel from '@/models/user'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        await UserModel.registerUser(body)

        return NextResponse.json({
            message: 'Register Successfull. Please Login',
        })
    } catch (error) {
        if (error instanceof ZodError) {
            const { message } = error.issues[0]

            return NextResponse.json({ message: `${message}` }, { status: 400 })
        }

        if (
            error instanceof Error &&
            error.message === 'Username already registered'
        ) {
            return NextResponse.json(
                { message: 'Username already registered' },
                { status: 400 }
            )
        }

        if (
            error instanceof Error &&
            error.message === 'Email already registered'
        ) {
            return NextResponse.json(
                { message: 'Email already registered' },
                { status: 400 }
            )
        }
        
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
