import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import OrderModel from '@/models/order'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getUserId()

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        const order = await OrderModel.findById(id)

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            )
        }

        if (order.userId.toString() !== String(userId)) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            )
        }

        return NextResponse.json({ data: order })
    } catch (err: unknown) {
        const error = err as Error
        console.error('❌ Get order detail error:', error)

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
