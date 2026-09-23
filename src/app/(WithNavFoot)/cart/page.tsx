'use client'

import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { CartItem } from '@/types/cartType'
import { CartContext } from '@/app/components/CartContext'
import idr from '@/lib/helper'

export default function CartPage() {
    const cartCtx = useContext(CartContext)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Gunakan cart global dari context
    const cart = cartCtx?.cart || []

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true)
            try {
                await cartCtx?.syncCart()
                setErrors({})
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        loadCart()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateQuantity = async (item: CartItem, newQty: number) => {
        if (newQty <= 0) return

        try {
            const res = await fetch(`/api/cart/${item.productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ size: item.size, quantity: newQty }),
            })

            const data = await res.json()
            if (!res.ok) {
                setErrors((prev) => ({
                    ...prev,
                    [item._id]: data.message || 'Failed to update cart.',
                }))
                setTimeout(() => {
                    setErrors((prev) => {
                        const newErr = { ...prev }
                        delete newErr[item._id]
                        return newErr
                    })
                }, 2000)
                return
            }

            await cartCtx?.syncCart() // 🔁 Sinkronisasi global cart
        } catch (error: unknown) {
            const err = error as Error
            setErrors((prev) => ({
                ...prev,
                [item._id]: err.message,
            }))
        }
    }

    const deleteItem = async (item: CartItem) => {
        try {
            const res = await fetch(`/api/cart`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: item.productId,
                    size: item.size,
                }),
            })

            const data = await res.json()
            if (!res.ok)
                throw new Error(data.message || 'Failed to delete item')

            await cartCtx?.syncCart() // 🔁 Update context juga
        } catch (error: unknown) {
            const err = error as Error
            alert(err.message)
        }
    }

    if (loading) {
        return (
            <div className="flex py-20 justify-center min-h-screen">
                <p className="text-lg font-semibold">Loading cart...</p>
            </div>
        )
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0,
    )

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-gray-800">Bag</h1>
                <div className="flex flex-col lg:flex-row gap-10 mt-12">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-6">
                        {cart.length === 0 ? (
                            <div>
                                <p className="text-gray-500 text-lg">
                                    There are no items in your bag
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-block bg-pink-400 text-white py-3 px-6 mt-4 rounded-full hover:bg-pink-500"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center border-b gap-4 pb-4"
                                >
                                    <Image
                                        src={
                                            item.product.thumbnail ||
                                            '/no-image.png'
                                        }
                                        alt={item.product.name}
                                        width={100}
                                        height={100}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h2 className="font-semibold">
                                            {item.product.name}
                                        </h2>
                                        <p className="text-gray-600">
                                            Size: {item.size}
                                        </p>
                                        <p className="font-semibold">
                                            {idr(item.price)}
                                        </p>

                                        <div className="flex flex-col mt-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteItem(item)
                                                    }
                                                    className="ml-4 text-red-500 cursor-pointer"
                                                >
                                                    <Trash2 className="w-6 h-6" />
                                                </button>
                                            </div>

                                            {errors[item._id] && (
                                                <p className="text-sm font-semibold text-red-500">
                                                    {errors[item._id]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Summary */}
                    <div className="w-full lg:w-1/3 bg-pink-100 p-6 rounded-lg h-fit">
                        <h2 className="text-lg font-semibold mb-4">Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Total Items:</span>
                            <span>{totalItems}</span>
                        </div>
                        <div className="flex justify-between mb-8 font-semibold">
                            <span>Total Price:</span>
                            <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                        </div>

                        <Link
                            href = '/checkout'
                            className="py-3 bg-pink-400 text-white flex justify-center rounded-full font-semibold hover:bg-pink-500 cursor-pointer"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
