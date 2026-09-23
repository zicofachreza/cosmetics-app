'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Order } from '@/types/orderType'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [totalOrders, setTotalOrders] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState<number>(1)
    const pageSize = 10

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)

                const params = new URLSearchParams()

                params.append('page', page.toString())
                params.append('pageSize', pageSize.toString())

                const res = await fetch(`/api/orders?${params.toString()}`, {
                    cache: 'no-store',
                })

                const data = await res.json()

                if (!res.ok) throw new Error(data.message)

                setOrders(data.data)
                setTotalOrders(data.total)
                setTotalPages(data.totalPages)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [page])

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

    const handlePrevPage = () => setPage((p) => Math.max(1, p - 1))
    const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1))

    if (loading) {
        return (
            <main className="flex py-20 justify-center min-h-screen">
                <p className="text-lg font-semibold">Loading orders...</p>
            </main>
        )
    }

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            My Orders
                        </h1>

                        <p className="text-gray-500 mt-2">
                            View and manage your order history
                        </p>
                    </div>
                </div>

                {/* EMPTY STATE */}
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow">
                        <p className="text-gray-500 text-lg">
                            You don’t have any orders yet
                        </p>

                        <Link
                            href="/products"
                            className="inline-block mt-7 bg-pink-400 text-white py-3 px-6 rounded-full hover:bg-pink-500 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-pink-100 text-gray-600 text-sm">
                                <tr>
                                    <th className="py-4 px-6 text-center">
                                        Order ID
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        Date
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        Total
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        Status
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr
                                        key={order.midtransOrderId}
                                        className="border-t hover:bg-gray-50 text-sm"
                                    >
                                        <td className="py-4 px-6 font-mono text-center">
                                            #
                                            {order.midtransOrderId
                                                .slice(-6)
                                                .toUpperCase()}
                                        </td>

                                        <td className="py-4 px-6 text-center">
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleString('id-ID', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </td>

                                        <td className="py-4 px-6 font-medium text-center">
                                            Rp{' '}
                                            {order.total.toLocaleString(
                                                'id-ID',
                                            )}
                                        </td>

                                        <td className="py-4 px-6 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(
                                                    order.status,
                                                )}`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6 text-center">
                                            <Link
                                                href={`/orders/${order._id}`}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                View Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* PAGINATION */}
                {orders.length > 0 && (
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-gray-600">
                            Showing{' '}
                            <span className="font-semibold">
                                {(page - 1) * pageSize + 1}
                            </span>{' '}
                            -{' '}
                            <span className="font-semibold">
                                {Math.min(page * pageSize, totalOrders)}
                            </span>{' '}
                            of{' '}
                            <span className="font-semibold">{totalOrders}</span>{' '}
                            orders
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${
                                page === 1
                                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100 border-gray-300'
                            }`}
                            >
                                <ChevronLeft size={16} />
                                Prev
                            </button>

                            <span className="text-sm font-medium text-gray-700">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${
                                page === 1
                                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100 border-gray-300'
                            }`}
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
