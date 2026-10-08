export const runtime = "nodejs"

import UserModel from '@/models/user'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        await UserModel.registerUser(body)

        return NextResponse.json({
            message: 'Pendaftaran berhasil. Silakan masuk',
        })
    } catch (error) {
        if (error instanceof ZodError) {
            const { message } = error.issues[0]

            return NextResponse.json({ message: `${message}` }, { status: 400 })
        }

        if (
            error instanceof Error &&
            error.message === 'Alamat email sudah terdaftar'
        ) {
            return NextResponse.json(
                { message: 'Alamat email sudah terdaftar' },
                { status: 400 }
            )
        }
        
        return NextResponse.json(
            { error: 'Kesalahan server internal' },
            { status: 500 }
        )
    }
}
