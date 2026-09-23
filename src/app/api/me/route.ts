import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { JWTPayload } from '@/types/userType'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const authorization = cookieStore.get('Authorization')

        if (!authorization) {
            return NextResponse.json(
                { ok: false, message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const token = authorization.value.split(' ')[1]
        const decoded = jwt.decode(token) as JWTPayload | null

        if (!decoded) {
            return NextResponse.json(
                { ok: false, message: 'Invalid token' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            ok: true,
            name: decoded.name,
            email: decoded.email,
            id: decoded._id,
            role: decoded.role,
        })
    } catch (err) {
        console.error('❌ Error in /api/me:', err)
        return NextResponse.json(
            { ok: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
