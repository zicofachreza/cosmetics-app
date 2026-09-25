'use client'

import { useState, useEffect, useMemo, useContext } from 'react'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { CartItem } from '@/types/cartType'
import { CartContext } from '@/app/components/CartContext'
import { MidtransResult } from '@/types/orderType'
import { useRouter } from 'next/navigation'
import idr from '@/lib/helper'

export default function CheckoutPage() {
    const router = useRouter()

    const [cart, setCart] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [paying, setPaying] = useState(false)
    const cartCtx = useContext(CartContext)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/me', { credentials: 'include' })
                const data = await res.json()

                if (res.ok && data.ok) {
                    setEmail(data.email)
                } else {
                    console.warn(
                        '⚠️ Failed to retrieve user info:',
                        data.message,
                    )
                }
            } catch (err) {
                console.error('❌ Error fetching user info:', err)
            }
        }

        fetchUser()
    }, [])

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart', { cache: 'no-store' })
            const data = await res.json()

            if (!res.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: data.message,
                    timer: 2000,
                    showConfirmButton: false,
                })
                setCart([])
                return
            }

            setCart(data.data || [])
        } catch (err: unknown) {
            const error = err as Error
            console.error(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                timer: 2000,
                showConfirmButton: false,
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const total = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
        [cart],
    )

    const handlePayment = async () => {
        if (!firstName || !lastName || !email || !address || !phone) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Form',
                text: 'Please fill all shipping details',
                timer: 2000,
                showConfirmButton: false,
            })
            return
        }

        setPaying(true)

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    address,
                    phone,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                    timer: 2000,
                    showConfirmButton: false,
                })
                setPaying(false)
                return
            }

            const { snapToken, orderId } = data.data

            cartCtx?.clearCart()

            window.snap.pay(snapToken, {
                onSuccess: function (result: MidtransResult) {
                    console.log('✅ Payment success:', result)
                    router.push(`/orders/${orderId}`)
                },
                onPending: function (result: MidtransResult) {
                    console.log('⏳ Payment pending:', result)
                    Swal.fire({
                        icon: 'info',
                        title: 'Payment Pending',
                        text: 'Please complete your payment',
                        timer: 2000,
                        showConfirmButton: false,
                    })
                    router.push(`/orders/${orderId}`)
                },
                onError: function (result: MidtransResult) {
                    console.error('❌ Payment failed:', result)
                    Swal.fire({
                        icon: 'error',
                        title: 'Payment Failed',
                        text: 'Please try again later.',
                        timer: 2000,
                        showConfirmButton: false,
                    })
                    setPaying(false)
                },
                onClose: function () {
                    console.log('💤 Payment popup closed.')
                    Swal.fire({
                        icon: 'info',
                        title: 'Payment Pending',
                        text: 'Please complete your payment',
                        timer: 2000,
                        showConfirmButton: false,
                    })
                    router.push(`/orders/${orderId}`)
                },
            })
        } catch (err: unknown) {
            const error = err as Error
            console.error(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                timer: 2000,
                showConfirmButton: false,
            })
            setPaying(false)
        }
    }

    if (loading) {
        return (
            <main className="flex py-20 justify-center min-h-screen">
                <p className="text-lg font-semibold">Loading checkout...</p>
            </main>
        )
    }

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
                {cart.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-500 text-lg">
                            No items to checkout
                        </p>
                        <Link
                            href="/products"
                            className="inline-block mt-7 bg-pink-400 text-white py-3 px-6 rounded-full hover:bg-pink-500"
                        >
                            Back to Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 mt-12">
                        {/* Left: Shipping form + Payment */}
                        <div className="space-y-6">
                            {/* Shipping */}
                            <section className="bg-white rounded-2xl shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    Shipping Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-2">
                                            First Name
                                        </label>
                                        <input
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            className="w-full border rounded-xl px-4 py-2"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            className="w-full border rounded-xl px-4 py-2"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm mb-2">
                                        Email
                                    </label>
                                    <input
                                        value={email}
                                        readOnly
                                        className="w-full border rounded-xl px-4 py-2 pointer-events-none"
                                        placeholder="john.doe@gmail.com"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm mb-2">
                                        Home Address
                                    </label>
                                    <textarea
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        className="w-full border rounded-xl px-4 py-2 min-h-[100px] resize-y"
                                        placeholder="Jl. Pahlawan No. 123, Purwokerto"
                                        required
                                    />
                                </div>
                                <div className="mt-3">
                                    <label className="block text-sm mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        className="w-full border rounded-xl px-4 py-2"
                                        placeholder="08xxxxxxxxxx"
                                        inputMode="tel"
                                        pattern="[0-9\-\+\s()]*"
                                        required
                                    />
                                </div>
                            </section>

                            {/* Payment */}
                            <section className="bg-white rounded-2xl shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    Payment
                                </h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    After clicking the <b>Pay Now</b> button,
                                    you will be directed to the Midtrans payment
                                    page.
                                </p>
                                <button
                                    onClick={handlePayment}
                                    disabled={paying}
                                    className={`mt-4 w-full bg-pink-400 text-white py-3 rounded-full font-semibold ${
                                        paying
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-pink-500 cursor-pointer'
                                    }`}
                                >
                                    {paying ? 'Processing...' : 'Pay Now'}
                                </button>
                            </section>
                        </div>

                        {/* Right: Summary */}
                        <aside className="bg-pink-100 rounded-2xl p-6 h-fit">
                            <h3 className="text-lg font-semibold mb-4">
                                Order Summary
                            </h3>
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.product.name} <br />{' '}
                                            {item.size} × {item.quantity}
                                        </span>
                                        <span>
                                            {idr(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>{idr(total)}</span>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    )
}
