import OrderModel from '@/models/order'
import ProductModel from '@/models/product'
import { ObjectId } from 'mongodb'

export async function cancelOrder(orderId: string, userId: string) {
    const order = await OrderModel.findById(orderId)

    if (!order) throw new Error('Order not found')

    if (order.userId.toString() !== String(userId)) {
        throw new Error('Forbidden')
    }

    if (order.status !== 'pending') {
        throw new Error('Only pending orders can be cancelled')
    }

    /**
     * 1️⃣ Cancel transaction in Midtrans
     */
    if (order.midtransOrderId) {
        const serverKey = process.env.MIDTRANS_SERVER_KEY!
        const auth = Buffer.from(serverKey + ':').toString('base64')

        await fetch(
            `https://api.sandbox.midtrans.com/v2/${order.midtransOrderId}/cancel`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json',
                },
            },
        )
    }

    /**
     * 2️⃣ Restore stock
     */
    for (const item of order.items) {
        await ProductModel.increaseStock(
            item.productId,
            item.size,
            item.quantity
        )
    }

    /**
     * 3️⃣ Update DB
     */
    await OrderModel.cancelOrder(new ObjectId(order._id))

    return {
        success: true,
        orderId,
    }
}