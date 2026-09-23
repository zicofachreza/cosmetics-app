import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import OrderModel from '@/models/order'

export async function GET(req: Request) {
    try {
        const user = await getUser()

        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (user.role !== 'admin') {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(req.url)

        const page = Number(searchParams.get('page') || 1)
        const pageSize = Number(searchParams.get('pageSize') || 10)

        const search = searchParams.get('search') || ''
        const status = searchParams.get('status') || ''

        const result = await OrderModel.findAllOrdersWithFilter({
            page,
            pageSize,
            search,
            status,
        })

        return NextResponse.json(result)
    } catch (err: unknown) {
        const error = err as Error

        console.error('❌ Admin fetch orders error:', error)

        return NextResponse.json(
            {
                message: 'Internal server error',
            },
            {
                status: 500,
            }
        )
    }
}