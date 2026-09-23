import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { cancelOrder } from '@/services/cancelOrderService'

export async function POST(
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

        const result = await cancelOrder(id, userId)

        return NextResponse.json({
            message: 'Order cancelled successfully',
            data: result
        })
    } catch (err: unknown) {
        const error = err as Error

        console.error('❌ Cancel order error:', error)

        return NextResponse.json(
            {
                message: error.message || 'Failed to cancel order'
            },
            { status: 500 }
        )
    }
}