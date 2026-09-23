import CartModel from '@/models/cart'
import OrderModel from '@/models/order'
import { snap } from '@/lib/midtrans'
import { ObjectId } from 'mongodb'
import { formatMidtransAddress } from '@/lib/helper'
import { ShippingInfo } from '@/types/userType'

export async function checkout(userId: string, shipping: ShippingInfo) {
    /**
     * 1️⃣ GET CART
     */
    const cartItems = await CartModel.findAllByUserId(userId)

    if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty')
    }

    /**
     * 2️⃣ CALCULATE TOTAL
     */
    const total = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    )

    /**
     * 3️⃣ INSERT ORDER FIRST (IMPORTANT)
     */
    const orderId = new ObjectId()

    const orderData = {
        _id: orderId,
        userId: new ObjectId(userId),

        items: cartItems.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
        })),

        shipping,

        total,

        status: 'pending',

        createdAt: new Date(),
        updatedAt: new Date()
    }

    await OrderModel.insertOrder(orderData)

    /**
     * 4️⃣ GENERATE MIDTRANS ORDER ID
     */
    const midtransOrderId = `ORDER-${Date.now()}-${Math.floor(
        Math.random() * 1000
    )}`

    const expiryTime = new Date()
    expiryTime.setHours(expiryTime.getHours() + 24)

    /**
     * 5️⃣ CREATE MIDTRANS TRANSACTION
     */
    const parameter = {
        transaction_details: {
            order_id: midtransOrderId,
            gross_amount: total,
        },

        customer_details: {
            first_name: shipping.firstName,
            last_name: shipping.lastName,
            email: shipping.email,
            phone: shipping.phone,
            billing_address: formatMidtransAddress(shipping),
            shipping_address: formatMidtransAddress(shipping),
        },

        item_details: cartItems.map((item) => ({
            id: item.productId.toString(),
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
        })),

        callbacks: {
            finish: `/orders/success`,
            error: `/orders/error`,
            pending: `/orders/pending`,
        },
    }

    const transaction = await snap.createTransaction(parameter)

    if (!transaction?.token) {
        throw new Error('Failed to create Midtrans transaction')
    }

    /**
     * 6️⃣ ATTACH MIDTRANS DATA TO ORDER
     */
    await OrderModel.attachMidtransData(orderId, {
        midtransOrderId,
        snapToken: transaction.token,
        snapRedirectUrl: transaction.redirect_url,
        expiryTime,
    })

    /**
     * 7️⃣ CLEAR CART
     */
    await CartModel.clearByUserId(userId)

    /**
     * 8️⃣ RETURN DATA
     */
    return {
        orderId: orderId.toString(),
        midtransOrderId,
        total,
        snapToken: transaction.token,
        redirectUrl: transaction.redirect_url,
    }
}