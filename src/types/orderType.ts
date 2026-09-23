import { ObjectId } from "mongodb"

export type Order = {
    _id: string
    userId: string
    midtransOrderId: string
    total: number
    status: string
    createdAt: Date
}

export interface AdminOrder {
    _id: string
    midtransOrderId: string
    createdAt: string
    total: number
    status: string
    userName: string
    userEmail: string
}

export interface OrderItem {
    productId: ObjectId;
    name: string;
    size: string;
    quantity: number;
    price: number;
}

export type OrderDetail = {
    _id: ObjectId
    userId: ObjectId
    total: number
    status: string
    midtransOrderId?: string
    createdAt: Date
    expiryTime?: Date
    snapToken?: string
    items: {
        productId: ObjectId
        name: string
        size: string
        quantity: number
        price: number
        subtotal: number
    }[]
    shipping: {
        firstName: string
        lastName: string
        email: string
        address: string
        phone: string
    }
}

export interface AdminOrderDetail {
    _id: string
    userId: string

    userName?: string
    userEmail?: string

    midtransOrderId: string
    snapToken?: string
    snapRedirectUrl?: string

    createdAt: string
    expiryTime?: string

    total: number
    status: string

    shipping: {
        firstName: string
        lastName: string
        email: string
        address: string
        phone: string
    }

    items: {
        productId: string
        name: string
        price: number
        size: string
        quantity: number
        subtotal: number
    }[]
}

export interface MidtransResult {
    transaction_time?: string
    transaction_status?:
        | 'capture'
        | 'settlement'
        | 'cancel'
        | 'expire'
        | 'deny'
        | 'pending'
    transaction_id?: string
    status_message?: string
    status_code?: string
    signature_key?: string
    payment_type?: string
    order_id?: string
    merchant_id?: string
    gross_amount?: string
    fraud_status?: 'accept' | 'challenge' | 'deny'
}