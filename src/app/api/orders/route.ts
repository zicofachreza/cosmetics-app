import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import OrderModel from '@/models/order'

export async function GET(req: Request) {
    try {
        const userId = await getUserId()
        if (!userId)
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            )

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '10')

        const result = await OrderModel.findOrdersWithFilter({
            request: req,
            userId,
            page,
            pageSize,
        })

        return NextResponse.json(result)
    } catch (err: unknown) {
        const error = err as Error
        console.error('❌ Fetch orders error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 },
        )
    }
}
