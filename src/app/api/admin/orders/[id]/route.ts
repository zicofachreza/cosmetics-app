import { NextResponse } from 'next/server'
import OrderModel from '@/models/order'
import { authorizeAdmin } from '@/lib/authorization'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const auth = await authorizeAdmin()

        if (auth.error) return auth.error

        const { id } = await params

        const order = await OrderModel.findById(id)

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 },
            )
        }

        return NextResponse.json({
            data: order,
        })
    } catch (err: unknown) {
        const error = err as Error

        console.error('❌ Get admin order detail error:', error)

        return NextResponse.json(
            {
                message: 'Internal server error',
            },
            {
                status: 500,
            },
        )
    }
}
