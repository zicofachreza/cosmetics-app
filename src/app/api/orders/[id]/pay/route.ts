import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { regeneratePayment } from '@/services/payAgainService'

export async function POST(
    request: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getUserId()
        if (!userId)
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { id } = await params

        const result = await regeneratePayment(id, userId)

        return NextResponse.json({
            message: 'Payment regenerated successfully',
            data: result,
        })
    } catch (err: unknown) {
        const error = err as Error
        console.error('❌ Pay Again Error:', error)
        return NextResponse.json(
            {
                message: 'Failed to regenerate payment',
                error: String(error.message || error),
            },
            { status: 500 }
        )
    }
}
