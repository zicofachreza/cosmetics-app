import { NextResponse } from 'next/server'
import OrderModel from '@/models/order'
import { authorizeAdmin } from '@/lib/authorization'

export async function GET(req: Request) {
    try {
        const auth = await authorizeAdmin()

        if (auth.error) return auth.error

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
            },
        )
    }
}
