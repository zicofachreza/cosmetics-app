import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as jose from 'jose'
import { cookies } from 'next/headers'
import { JWTPayload } from '@/types/userType'

const JWT_SECRET = process.env.JWT_SECRET!

const JWT_SECRET_JOSE = new TextEncoder().encode(
    JWT_SECRET
)

export const comparePassword = (
    password: string,
    hashedPassword: string
) => {
    return bcrypt.compareSync(
        password,
        hashedPassword
    )
}

export const signToken = (
    data: JWTPayload
): string => {
    return jwt.sign(
        data,
        JWT_SECRET,
        {
            expiresIn: '1d',
        }
    )
}

export const verifyToken = async (
    token: string
) => {
    return await jose.jwtVerify<JWTPayload>(
        token,
        JWT_SECRET_JOSE
    )
}

export async function getUser() {
    try {
        const cookieStore = await cookies()

        const raw =
            cookieStore.get('Authorization')?.value

        if (!raw) {
            return null
        }

        const token = raw.startsWith('Bearer ')
            ? raw.split(' ')[1]
            : raw

        const { payload } =
            await verifyToken(token)

        return payload
    } catch {
        return null
    }
}

export async function getUserId(): Promise<string | null> {
    const user = await getUser()

    return user?._id ?? null
}