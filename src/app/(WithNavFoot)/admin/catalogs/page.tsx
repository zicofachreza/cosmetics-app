'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { TProduct } from '@/types/productType'
import idr from '@/lib/helper'
import Swal from 'sweetalert2'

export default function AdminCatalogsPage() {
    const [products, setProducts] = useState<TProduct[]>([])
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(1)

    const [totalProducts, setTotalProducts] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const pageSize = 10

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true)

            const params = new URLSearchParams()

            params.append('page', page.toString())
            params.append('limit', pageSize.toString())

            const res = await fetch(
                `/api/admin/products?${params.toString()}`,
                {
                    cache: 'no-store',
                },
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }

            setProducts(data.data)
            setTotalProducts(data.total)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.error(error)

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load products.',
            })
        } finally {
            setLoading(false)
        }
    }, [page])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handlePrevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setPage((prev) => Math.min(prev + 1, totalPages))
    }

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete Product?',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                actions: 'flex gap-2',
                confirmButton:
                    'bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer',
                cancelButton:
                    'bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg cursor-pointer',
            },
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        })

        if (!result.isConfirmed) return

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }

            await Swal.fire({
                icon: 'success',
                title: 'Product Deleted!',
                text: data.message,
                timer: 2000,
                showConfirmButton: false,
            })

            // Jika item terakhir pada halaman ini dihapus,
            // kembali ke halaman sebelumnya.
            if (products.length === 1 && page > 1) {
                setPage((prev) => prev - 1)
            } else {
                await fetchProducts()
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text:
                    error instanceof Error
                        ? error.message
                        : 'Something went wrong.',
            })
        }
    }

    if (loading) {
        return (
            <main className="flex justify-center py-20 min-h-screen">
                <p className="text-lg font-semibold">Loading products...</p>
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
                            Catalog
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Manage all products in your catalog
                        </p>
                    </div>

                    <Link
                        href="/admin/catalogs/add"
                        className="inline-flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-5 py-3 rounded-xl font-medium transition mt-5"
                    >
                        <Plus size={18} />
                        Add Product
                    </Link>
                </div>

                {/* EMPTY STATE */}
                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow py-20 text-center">
                        <p className="text-lg text-gray-500">
                            No products found
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-pink-100 text-gray-700 text-sm">
                                <tr>
                                    <th className="px-6 py-4 text-center">
                                        Product
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Size
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Price
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Stock
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr
                                        key={product._id.toString()}
                                        className="border-t hover:bg-gray-50 text-sm"
                                    >
                                        {/* PRODUCT */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    className="w-16 h-16 rounded-lg object-cover border"
                                                />

                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {product.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {product.category}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* SIZE */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-2">
                                                {product.sizes.map((size) => (
                                                    <span
                                                        key={size.size}
                                                        className="px-2 py-1 rounded bg-gray-100 text-xs font-medium"
                                                    >
                                                        {size.size}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* PRICE */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-1 font-medium">
                                                {product.sizes.map((size) => (
                                                    <span key={size.size}>
                                                        {idr(size.price)}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* STOCK */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-1">
                                                {product.sizes.map((size) => (
                                                    <span
                                                        key={size.size}
                                                        className={`font-semibold ${
                                                            size.stock === 0
                                                                ? 'text-red-600'
                                                                : size.stock <=
                                                                    5
                                                                  ? 'text-yellow-600'
                                                                  : 'text-green-600'
                                                        }`}
                                                    >
                                                        {size.stock}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* ACTION */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-4">
                                                <Link
                                                    href={`/admin/catalogs/${product._id}/edit`}
                                                    className="p-2 rounded-full hover:bg-blue-100 text-blue-500 transition"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            product._id.toString(),
                                                        )
                                                    }
                                                    className="p-2 rounded-full hover:bg-red-100 text-red-500 transition cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* PAGINATION */}
                {products.length > 0 && (
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-gray-600">
                            Showing{' '}
                            <span className="font-semibold">
                                {(page - 1) * pageSize + 1}
                            </span>{' '}
                            -{' '}
                            <span className="font-semibold">
                                {Math.min(page * pageSize, totalProducts)}
                            </span>{' '}
                            of{' '}
                            <span className="font-semibold">
                                {totalProducts}
                            </span>{' '}
                            products
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className={`flex items-center gap-1 px-3 py-2 border rounded-lg text-sm ${
                                    page === 1
                                        ? 'cursor-not-allowed text-gray-400 border-gray-200'
                                        : 'border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                <ChevronLeft size={16} />
                                Prev
                            </button>

                            <span className="text-sm font-medium">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className={`flex items-center gap-1 px-3 py-2 border rounded-lg text-sm ${
                                    page === totalPages
                                        ? 'cursor-not-allowed text-gray-400 border-gray-200'
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
