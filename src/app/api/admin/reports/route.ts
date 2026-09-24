import { NextResponse } from 'next/server'
import OrderModel from '@/models/order'
import { authorizeAdmin } from '@/lib/authorization'

export async function GET(req: Request) {
    try {
        const auth = await authorizeAdmin()

        if (auth.error) return auth.error

        const { searchParams } = new URL(req.url)

        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        const result = await OrderModel.getReportData({
            startDate,
            endDate,
        })

        return NextResponse.json(result)
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 },
        )
    }
}
