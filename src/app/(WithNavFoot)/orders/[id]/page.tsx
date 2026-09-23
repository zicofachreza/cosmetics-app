'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { OrderDetail } from '@/types/orderType'
import idr from '@/lib/helper'

export default function OrderDetailPage() {
    const { id } = useParams()
    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [paying, setPaying] = useState(false)

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                cache: 'no-store',
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            setOrder(data.data)
        } catch (err) {
            console.error('❌ Failed to fetch order:', err)
        }
    }

    useEffect(() => {
        const loadOrder = async () => {
            setLoading(true)
            await fetchOrder()
            setLoading(false)
        }

        if (id) loadOrder()
    }, [id])

    const handleContinuePayment = () => {
        if (!order?.snapToken) {
            Swal.fire({
                icon: 'error',
                title: 'Snap token not found',
                timer: 2000,
                showConfirmButton: false,
            })
            return
        }

        setPaying(true)

        window.snap.pay(order.snapToken, {
            onSuccess: async () => {
                await fetchOrder()
                setPaying(false)
            },
            onPending: async () => {
                await fetchOrder()

                Swal.fire({
                    icon: 'info',
                    title: 'Payment Pending',
                    text: 'Please complete your payment',
                    timer: 2000,
                    showConfirmButton: false,
                })

                setPaying(false)
            },
            onClose: () => {
                Swal.fire({
                    icon: 'info',
                    title: 'Payment Pending',
                    text: 'Please complete your payment',
                    timer: 2000,
                    showConfirmButton: false,
                })

                setPaying(false)
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Payment failed',
                    timer: 2000,
                    showConfirmButton: false,
                })

                setPaying(false)
            },
        })
    }

    const handleCancelPayment = async () => {
        const result = await Swal.fire({
            title: 'Cancel Payment',
            text: 'Are you sure you want to cancel this payment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ec4899',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'Back',
        })

        if (!result.isConfirmed) return

        setPaying(true)

        try {
            const res = await fetch(`/api/orders/${id}/cancel`, {
                method: 'POST',
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            await fetchOrder()

            Swal.fire({
                icon: 'success',
                title: 'Payment Cancelled',
                text: 'Your payment has been successfully cancelled',
                timer: 2000,
                showConfirmButton: false,
            })
        } catch (err) {
            console.error('❌ Cancel payment failed:', err)

            Swal.fire({
                icon: 'error',
                title: 'Failed to cancel payment',
                timer: 2000,
                showConfirmButton: false,
            })
        } finally {
            setPaying(false)
        }
    }

    const handlePayAgain = async () => {
        setPaying(true)

        try {
            const res = await fetch(`/api/orders/${id}/pay`, {
                method: 'POST',
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            window.snap.pay(data.data.snapToken, {
                onSuccess: async () => {
                    await fetchOrder()
                    setPaying(false)
                },
                onPending: async () => {
                    await fetchOrder()

                    Swal.fire({
                        icon: 'info',
                        title: 'Payment Pending',
                        text: 'Please complete your payment',
                        timer: 2000,
                        showConfirmButton: false,
                    })

                    setPaying(false)
                },
                onClose: async () => {
                    await fetchOrder()

                    Swal.fire({
                        icon: 'info',
                        title: 'Payment Pending',
                        text: 'Please complete your payment',
                        timer: 2000,
                        showConfirmButton: false,
                    })

                    setPaying(false)
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Payment failed',
                        timer: 2000,
                        showConfirmButton: false,
                    })

                    setPaying(false)
                },
            })
        } catch (err) {
            console.error('❌ Failed to reinitiate payment:', err)

            Swal.fire({
                icon: 'error',
                title: 'Failed to create new payment',
                timer: 2000,
                showConfirmButton: false,
            })

            setPaying(false)
        }
    }

    if (loading) {
        return (
            <main className="flex py-20 justify-center min-h-screen">
                <p className="text-lg font-semibold">
                    Loading order details...
                </p>
            </main>
        )
    }

    if (!order) {
        return (
            <main className="flex py-20 justify-center min-h-screen">
                <p className="text-lg text-gray-600">Order not found.</p>
            </main>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-700'
            case 'pending':
                return 'bg-yellow-100 text-yellow-700'
            case 'cancelled':
            case 'failed':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    const isPending = order.status === 'pending'
    const isExpired =
        order.expiryTime && new Date(order.expiryTime) < new Date()

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <Link
                    href="/orders"
                    className="text-pink-400 hover:underline text-sm"
                >
                    ← Back to Orders
                </Link>

                <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-6">
                    Order Details
                </h1>

                <section className="bg-white rounded-2xl shadow p-6 mb-8 mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Order ID</h2>
                        <span
                            className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                order.status,
                            )}`}
                        >
                            {order.status.toUpperCase()}
                        </span>
                    </div>

                    <p className="text-gray-700 mb-2">
                        #{order.midtransOrderId}
                    </p>

                    <p className="text-gray-500 text-sm">
                        Ordered on{' '}
                        {new Date(order.createdAt).toLocaleString('id-ID')}
                    </p>
                </section>

                <section className="bg-white rounded-2xl shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Shipping Information
                    </h2>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            {order.shipping.firstName} {order.shipping.lastName}
                        </p>
                        <p className="text-gray-700">
                            {order.shipping.address}
                        </p>
                        <p className="text-gray-700">{order.shipping.phone}</p>
                    </div>
                </section>

                <section className="bg-pink-100 rounded-2xl shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Items</h2>

                    <div className="space-y-3">
                        {order.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between text-sm"
                            >
                                <span>
                                    {item.name} (Size {item.size}) ×{' '}
                                    {item.quantity}
                                </span>

                                <span>{idr(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{idr(order.total)}</span>
                    </div>
                </section>

                {order.status === 'paid' ? (
                    <p className="text-green-600 font-semibold mb-6">
                        ✅ Payment completed
                    </p>
                ) : isPending && !isExpired ? (
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleCancelPayment}
                            disabled={paying}
                            className={`bg-pink-400 text-white py-3 px-6 rounded-full ${
                                paying
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-pink-500 cursor-pointer'
                            }`}
                        >
                            Cancel Payment
                        </button>

                        <button
                            onClick={handleContinuePayment}
                            disabled={paying}
                            className={`bg-pink-400 text-white py-3 px-6 rounded-full ${
                                paying
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-pink-500 cursor-pointer'
                            }`}
                        >
                            {paying ? 'Processing...' : 'Continue Payment'}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handlePayAgain}
                        disabled={paying}
                        className={`bg-pink-400 text-white py-3 px-6 rounded-full ${
                            paying
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-pink-500 cursor-pointer'
                        }`}
                    >
                        {paying ? 'Processing...' : 'Pay Again'}
                    </button>
                )}
            </div>
        </section>
    )
}
