import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import OrderModel from '@/models/order'

export async function GET(req: Request) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            )
        }

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
