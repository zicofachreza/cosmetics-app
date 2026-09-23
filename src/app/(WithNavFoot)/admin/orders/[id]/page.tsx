'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import idr from '@/lib/helper'
import { AdminOrderDetail } from '@/types/orderType'

export default function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>()

    const [order, setOrder] = useState<AdminOrderDetail | null>(null)

    const [loading, setLoading] = useState(true)

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                cache: 'no-store',
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }

            setOrder(data.data)
        } catch (err) {
            console.error('❌ Failed to fetch admin order:', err)
        }
    }

    useEffect(() => {
        const loadOrder = async () => {
            setLoading(true)
            await fetchOrder()
            setLoading(false)
        }

        if (id) {
            loadOrder()
        }
    }, [id])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-700'

            case 'pending':
                return 'bg-yellow-100 text-yellow-700'

            case 'failed':
            case 'cancelled':
                return 'bg-red-100 text-red-700'

            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    if (loading) {
        return (
            <main className="flex justify-center py-20 min-h-screen">
                <p className="text-lg font-semibold">
                    Loading order details...
                </p>
            </main>
        )
    }

    if (!order) {
        return (
            <main className="flex justify-center py-20 min-h-screen">
                <p className="text-lg text-gray-600">Order not found.</p>
            </main>
        )
    }

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <Link
                    href="/admin/orders"
                    className="text-pink-400 hover:underline text-sm"
                >
                    ← Back to Orders
                </Link>

                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-8">
                        Order Details
                    </h1>
                </div>

                {/* CUSTOMER */}
                <section className="bg-white rounded-2xl shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-5">
                        Customer Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">
                                {order.userName ??
                                    `${order.shipping.firstName} ${order.shipping.lastName}`}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p>{order.userEmail ?? order.shipping.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p>{order.shipping.phone}</p>
                        </div>
                    </div>
                </section>

                {/* SHIPPING */}
                <section className="bg-white rounded-2xl shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-5">
                        Shipping Information
                    </h2>

                    <div className="space-y-2">
                        <p>
                            {order.shipping.firstName} {order.shipping.lastName}
                        </p>

                        <p>{order.shipping.address}</p>

                        <p>{order.shipping.phone}</p>

                        <p>{order.shipping.email}</p>
                    </div>
                </section>

                {/* ITEMS */}
                <section className="bg-white rounded-2xl shadow overflow-hidden mb-8">
                    <div className="px-6 py-5">
                        <h2 className="text-xl font-semibold">Order Items</h2>
                    </div>

                    <table className="w-full">
                        <thead className="text-base">
                            <tr>
                                <th className="text-left px-6 py-3">Product</th>

                                <th className="text-left px-6 py-3">Size</th>

                                <th className="text-left px-6 py-3">Price</th>

                                <th className="text-center px-6 py-3">Qty</th>

                                <th className="text-right px-6 py-3">
                                    Subtotal
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-6 py-4">{item.name}</td>

                                    <td className="px-6 py-4">{item.size}</td>

                                    <td className="px-6 py-4 text-left">
                                        {idr(item.price)}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {item.quantity}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        {idr(item.subtotal)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* PAYMENT */}
                <section className="bg-pink-100 rounded-2xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-5">
                        Payment Information
                    </h2>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Order ID</span>
                            <span>{order.midtransOrderId}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Created At</span>
                            <span>
                                {new Date(order.createdAt).toLocaleString(
                                    'id-ID',
                                )}
                            </span>
                        </div>

                        {order.expiryTime && (
                            <div className="flex justify-between">
                                <span>Expiry</span>

                                <span>
                                    {new Date(order.expiryTime).toLocaleString(
                                        'id-ID',
                                    )}
                                </span>
                            </div>
                        )}

                        <hr />

                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>{idr(order.total)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Status</span>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                    order.status,
                                )}`}
                            >
                                {order.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}
