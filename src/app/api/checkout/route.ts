import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { checkout } from '@/services/checkoutService'

export async function POST(req: Request) {
    try {
        const userId = await getUserId()
        if (!userId)
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )

        const body = await req.json()
        const { firstName, lastName, email, address, phone } = body

        if (!firstName || !lastName || !email || !address || !phone)
            return NextResponse.json(
                { message: 'Incomplete shipping details' },
                { status: 400 }
            )

        const result = await checkout(userId, {
            firstName,
            lastName,
            email,
            address,
            phone,
        })

        return NextResponse.json({
            message: 'Checkout success',
            data: result,
        })
    } catch (err: unknown) {
        const error = err as Error
        console.error('Checkout Error:', error)
        return NextResponse.json(
            {
                message: 'Checkout failed',
                error: String(error.message || error),
            },
            { status: 500 }
        )
    }
}
