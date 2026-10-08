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
                title: 'Snap token tidak ditemukan',
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
                    title: 'Pembayaran Belum Selesai',
                    text: 'Silakan selesaikan pembayaran Anda',
                    timer: 2000,
                    showConfirmButton: false,
                })

                setPaying(false)
            },

            onClose: () => {
                Swal.fire({
                    icon: 'info',
                    title: 'Pembayaran Belum Selesai',
                    text: 'Silakan selesaikan pembayaran Anda',
                    timer: 2000,
                    showConfirmButton: false,
                })

                setPaying(false)
            },

            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Pembayaran Gagal',
                    timer: 2000,
                    showConfirmButton: false,
                })

                setPaying(false)
            },
        })
    }

    const handleCancelPayment = async () => {
        const result = await Swal.fire({
            title: 'Batalkan Pembayaran',
            text: 'Apakah Anda yakin ingin membatalkan pembayaran ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ec4899',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Batalkan',
            cancelButtonText: 'Kembali',
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
                title: 'Pembayaran Dibatalkan',
                text: 'Pembayaran Anda berhasil dibatalkan',
                timer: 2000,
                showConfirmButton: false,
            })
        } catch (err) {
            console.error('❌ Cancel payment failed:', err)

            Swal.fire({
                icon: 'error',
                title: 'Gagal Membatalkan Pembayaran',
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
                        title: 'Pembayaran Belum Selesai',
                        text: 'Silakan selesaikan pembayaran Anda',
                        timer: 2000,
                        showConfirmButton: false,
                    })

                    setPaying(false)
                },

                onClose: async () => {
                    await fetchOrder()

                    Swal.fire({
                        icon: 'info',
                        title: 'Pembayaran Belum Selesai',
                        text: 'Silakan selesaikan pembayaran Anda',
                        timer: 2000,
                        showConfirmButton: false,
                    })

                    setPaying(false)
                },

                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Pembayaran Gagal',
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
                title: 'Gagal Membuat Pembayaran Baru',
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
                    Memuat detail pesanan...
                </p>
            </main>
        )
    }

    if (!order) {
        return (
            <main className="flex py-20 justify-center min-h-screen">
                <p className="text-lg text-gray-600">
                    Pesanan tidak ditemukan
                </p>
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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid':
                return 'Pembayaran Berhasil'

            case 'pending':
                return 'Pembayaran Tertunda'

            case 'cancelled':
                return 'Pembayaran Batal'

            case 'failed':
                return 'Pembayaran Gagal'

            default:
                return status
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
                    ← Kembali ke Pesanan Saya
                </Link>

                <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-6">
                    Detail Pesanan
                </h1>

                {/* ORDER STATUS */}
                <section className="bg-white rounded-2xl shadow p-6 mb-8 mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            No. Pesanan
                        </h2>

                        <span
                            className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                order.status,
                            )}`}
                        >
                            {getStatusLabel(order.status)}
                        </span>
                    </div>

                    <p className="text-gray-700 mb-2">
                        #{order.midtransOrderId}
                    </p>

                    <p className="text-gray-500 text-sm">
                        Dipesan pada{' '}
                        {new Date(order.createdAt).toLocaleString('id-ID')}
                    </p>
                </section>

                {/* SHIPPING */}
                <section className="bg-white rounded-2xl shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Informasi Pengiriman
                    </h2>

                    <div className="space-y-2">
                        <p className="text-gray-700">
                            {order.shipping.firstName}{' '}
                            {order.shipping.lastName}
                        </p>

                        <p className="text-gray-700">
                            {order.shipping.address}
                        </p>

                        <p className="text-gray-700">
                            {order.shipping.phone}
                        </p>
                    </div>
                </section>

                {/* PRODUCTS */}
                <section className="bg-pink-100 rounded-2xl shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Produk
                    </h2>

                    <div className="space-y-3">
                        {order.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between text-sm"
                            >
                                <span>
                                    {item.name} (Ukuran {item.size}) ×{' '}
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

                {/* PAYMENT ACTION */}
                {order.status === 'paid' ? (
                    <p className="text-green-600 font-semibold mb-6">
                        ✅ Pembayaran Selesai
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
                            Batalkan Pembayaran
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
                            {paying
                                ? 'Memproses...'
                                : 'Lanjutkan Pembayaran'}
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
                        {paying ? 'Memproses...' : 'Bayar Kembali'}
                    </button>
                )}
            </div>
        </section>
    )
}
