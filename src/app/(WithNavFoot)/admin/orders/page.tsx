'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { AdminOrder } from '@/types/orderType'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<AdminOrder[]>([])
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(1)
    const pageSize = 10

    const [totalOrders, setTotalOrders] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const [status, setStatus] = useState('')

    const [openStatus, setOpenStatus] = useState(false)
    const statusRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput)
            setPage(1)
        }, 500)

        return () => clearTimeout(timeout)
    }, [searchInput])

    useEffect(() => {
        fetchOrders()
    }, [page, search, status])

    const fetchOrders = async () => {
        try {
            setLoading(true)

            const params = new URLSearchParams()

            params.append('page', page.toString())
            params.append('pageSize', pageSize.toString())

            if (search) {
                params.append('search', search)
            }

            if (status) {
                params.append('status', status)
            }

            const res = await fetch(`/api/admin/orders?${params.toString()}`, {
                cache: 'no-store',
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }

            setOrders(data.data)
            setTotalOrders(data.total)
            setTotalPages(data.totalPages)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
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

    const handlePrevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setPage((prev) => Math.min(prev + 1, totalPages))
    }

    if (loading) {
        return (
            <main className="flex justify-center py-20 min-h-screen">
                <p className="text-lg font-semibold">Loading orders...</p>
            </main>
        )
    }

    return (
        <section className="py-14">
            <div className="max-w-7xl mx-auto px-6">
                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Orders
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Manage all customer orders
                        </p>
                    </div>

                    <div className="bg-pink-100 p-4 rounded-xl shadow-sm mb-6 mt-6 flex items-center justify-between gap-4">
                        {/* SEARCH */}
                        <div className="flex items-center bg-white text-sm w-72 px-4 py-2 rounded-full gap-2">
                            <Image
                                src="/search.png"
                                alt="Search"
                                width={16}
                                height={16}
                            />

                            <input
                                type="text"
                                placeholder="Search Customer"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="bg-transparent outline-none flex-1"
                            />
                        </div>

                        {/* FILTER STATUS */}
                        <div ref={statusRef} className="relative">
                            <button
                                onClick={() => setOpenStatus(!openStatus)}
                                className="flex items-center justify-between w-44 bg-white px-4 py-2 rounded-full text-sm"
                            >
                                {status === ''
                                    ? 'All Status'
                                    : status === 'paid'
                                      ? 'Paid'
                                      : status === 'pending'
                                        ? 'Pending'
                                        : status === 'failed'
                                          ? 'Failed'
                                          : 'Cancelled'}

                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${
                                        openStatus ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openStatus && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                    >
                                        <button
                                            onClick={() => {
                                                setStatus('')
                                                setPage(1)
                                                setOpenStatus(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                status === ''
                                                    ? 'bg-gray-100'
                                                    : ''
                                            }`}
                                        >
                                            All Status
                                        </button>

                                        <button
                                            onClick={() => {
                                                setStatus('paid')
                                                setPage(1)
                                                setOpenStatus(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                status === 'paid'
                                                    ? 'bg-gray-100'
                                                    : ''
                                            }`}
                                        >
                                            Paid
                                        </button>

                                        <button
                                            onClick={() => {
                                                setStatus('pending')
                                                setPage(1)
                                                setOpenStatus(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                status === 'pending'
                                                    ? 'bg-gray-100'
                                                    : ''
                                            }`}
                                        >
                                            Pending
                                        </button>

                                        <button
                                            onClick={() => {
                                                setStatus('failed')
                                                setPage(1)
                                                setOpenStatus(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                status === 'failed'
                                                    ? 'bg-gray-100'
                                                    : ''
                                            }`}
                                        >
                                            Failed
                                        </button>

                                        <button
                                            onClick={() => {
                                                setStatus('cancelled')
                                                setPage(1)
                                                setOpenStatus(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                status === 'cancelled'
                                                    ? 'bg-gray-100'
                                                    : ''
                                            }`}
                                        >
                                            Cancelled
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* EMPTY */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow py-20 text-center">
                        <p className="text-lg text-gray-500">No orders found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-pink-100 text-gray-600 text-sm">
                                <tr>
                                    <th className="px-6 py-4 text-center">
                                        Order ID
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Total
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="border-t hover:bg-gray-50 text-sm"
                                    >
                                        <td className="px-6 py-4 text-center">
                                            <div className="font-mono font-medium">
                                                #
                                                {order.midtransOrderId
                                                    .slice(-6)
                                                    .toUpperCase()}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="font-semibold text-gray-800">
                                                {order.userName}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                {order.userEmail}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-center">
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleString('id-ID', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-center">
                                            Rp{' '}
                                            {order.total.toLocaleString(
                                                'id-ID',
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                                    order.status,
                                                )}`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={`/admin/orders/${order._id}`}
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
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
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm transition ${
                                    page === 1
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                <ChevronLeft size={16} />
                                Prev
                            </button>

                            <span className="text-sm font-medium text-gray-700 px-2">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm transition ${
                                    page === totalPages
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'border-gray-300 hover:bg-gray-100'
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
