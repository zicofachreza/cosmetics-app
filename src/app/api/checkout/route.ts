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
        console.error('========== CHECKOUT ERROR ==========')
    console.error(err)
    console.error('====================================')

    const error = err as Error

    return NextResponse.json(
        {
            message: 'Checkout failed',
            error: error.message || String(error),
        },
        { status: 500 }
    )
    }
}
