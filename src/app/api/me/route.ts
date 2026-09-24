import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'

export async function GET() {
    try {
        const user = await getUser()

        if (!user) {
            return NextResponse.json(
                {
                    ok: false,
                    message: 'Unauthorized',
                },
                {
                    status: 401,
                }
            )
        }

        return NextResponse.json({
            ok: true,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })
    } catch (error) {
        console.error('❌ Error in /api/me:', error)

        return NextResponse.json(
            {
                ok: false,
                message: 'Internal server error',
            },
            {
                status: 500,
            }
        )
    }
}