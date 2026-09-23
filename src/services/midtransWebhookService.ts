import OrderModel from '@/models/order'
import ProductModel from '@/models/product'
import { MidtransResult } from '@/types/orderType'

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function processMidtransWebhook(body: MidtransResult) {
    const statusResponse = body

    const orderId = statusResponse.order_id
    if (!orderId) {
        throw new Error('Midtrans webhook missing order_id')
    }

    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    console.log('📩 Webhook received:', {
        orderId,
        transactionStatus,
    })

    let newStatus = 'pending'

    if (transactionStatus === 'capture') {
        if (fraudStatus === 'accept') newStatus = 'paid'
        else if (fraudStatus === 'challenge') newStatus = 'pending'
        else newStatus = 'cancelled'
    } else if (transactionStatus === 'settlement') {
        newStatus = 'paid'
    } else if (
        transactionStatus === 'cancel' ||
        transactionStatus === 'expire' ||
        transactionStatus === 'deny'
    ) {
        newStatus = 'cancelled'
    }

    /**
     * IMPORTANT:
     * Sometimes webhook arrives before order insert completes.
     * Retry finding order up to 5 times.
     */
    let order = null

    for (let i = 0; i < 5; i++) {
        order = await OrderModel.findByMidtransOrderId(orderId)

        if (order) break

        console.warn(`⚠️ Order not found, retry ${i + 1}/5`)
        await sleep(500)
    }

    if (!order) {
        console.error('❌ Order still not found after retry:', orderId)

        /**
         * Return success so Midtrans does not retry forever.
         */
        return {
            orderId,
            newStatus: 'ignored',
        }
    }

    /**
     * STOCK HANDLING
     */
    if (newStatus === 'pending') {
        for (const item of order.items) {
            await ProductModel.decreaseStock(
                item.productId,
                item.size,
                item.quantity
            )
        }
    }

    if (newStatus === 'cancelled') {
        for (const item of order.items) {
            await ProductModel.increaseStock(
                item.productId,
                item.size,
                item.quantity
            )
        }
    }

    await OrderModel.updateStatusByMidtrans(orderId, newStatus)

    console.log('✅ Order status updated:', {
        orderId,
        newStatus,
    })

    return { orderId, newStatus }
}