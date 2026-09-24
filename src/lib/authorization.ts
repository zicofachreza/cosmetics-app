import { NextResponse } from 'next/server'
import { getUser } from "./auth"

export async function authorizeAdmin() {
    const user = await getUser()

    if (!user) {
        return {
            error: NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            ),
        }
    }

    if (user.role !== 'admin') {
        return {
            error: NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 },
            ),
        }
    }

    return { user }
}