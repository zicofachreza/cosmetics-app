import OrderModel from '@/models/order'
import { snap } from '@/lib/midtrans'
import { ObjectId } from 'mongodb'
import { OrderItem } from '@/types/orderType'

export async function regeneratePayment(orderId: string, userId: string) {
    const order = await OrderModel.findById(orderId)
    if (!order) throw new Error('Order not found')

    if (order.userId.toString() !== String(userId)) {
        throw new Error('Forbidden')
    }

    if (order.status === 'paid') {
        throw new Error('Order already paid')
    }

    const newMidtransOrderId = `ORDER-${Date.now()}-${Math.floor(
        Math.random() * 1000
    )}`

    const parameter = {
        transaction_details: {
            order_id: newMidtransOrderId,
            gross_amount: order.total,
        },
        customer_details: order.shipping
            ? {
                  first_name: order.shipping.firstName,
                  last_name: order.shipping.lastName,
                  email: order.shipping.email,
                  phone: order.shipping.phone,
                  billing_address: {
                      first_name: order.shipping.firstName,
                      last_name: order.shipping.lastName,
                      email: order.shipping.email,
                      phone: order.shipping.phone,
                      address: order.shipping.address,
                  },
                  shipping_address: {
                      first_name: order.shipping.firstName,
                      last_name: order.shipping.lastName,
                      email: order.shipping.email,
                      phone: order.shipping.phone,
                      address: order.shipping.address,
                  },
              }
            : undefined,
        item_details: order.items?.map((item: OrderItem) => ({
            id: item.productId.toString(),
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
        callbacks: {
            finish: `${process.env.NEXT_PUBLIC_APP_URL}/orders/success`,
            error: `${process.env.NEXT_PUBLIC_APP_URL}/orders/error`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/orders/pending`,
        },
    }

    const transaction = await snap.createTransaction(parameter)
    if (!transaction?.token) {
        throw new Error('Failed to create Midtrans transaction')
    }

    const expiryTime = new Date()
    expiryTime.setHours(expiryTime.getHours() + 24)

    await OrderModel.attachMidtransData(new ObjectId(order._id), {
        midtransOrderId: newMidtransOrderId,
        snapToken: transaction.token,
        snapRedirectUrl: transaction.redirect_url,
        expiryTime,
    })

    await OrderModel.updateStatus(new ObjectId(order._id), 'pending')

    return {
        snapToken: transaction.token,
        redirectUrl: transaction.redirect_url,
    }
}
