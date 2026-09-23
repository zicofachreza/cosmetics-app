import { NextResponse } from 'next/server'
import { processMidtransWebhook } from '@/services/midtransWebhookService'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const result = await processMidtransWebhook(body)

        return NextResponse.json({
            message: 'Webhook processed',
            data: result,
        })
    } catch (err: unknown) {
        const error = err as Error

        console.error('❌ Midtrans Webhook Error:', error)

        /**
         * IMPORTANT:
         * Always return 200 to Midtrans
         * otherwise they will keep retrying webhook
         */
        return NextResponse.json({
            message: 'Webhook received but error occurred',
        })
    }
}