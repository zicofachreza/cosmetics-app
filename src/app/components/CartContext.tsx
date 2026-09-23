'use client'

import {
    createContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react'
import Swal from 'sweetalert2'
import { redirect } from 'next/navigation'
import { CartItem } from '@/types/cartType'

export const CartContext = createContext<{
    cart: CartItem[]
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
    syncCart: () => Promise<void>
    addToCart: (
        productId: string,
        size: string,
        quantity: number,
    ) => Promise<void>
    emitCartUpdate: () => void
    clearCart: () => void
    isOnline: boolean
    user: boolean
} | null>(null)

interface CartProviderProps {
    children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cart, setCart] = useState<CartItem[]>([])
    const [user, setUser] = useState(false)
    const [isOnline, setIsOnline] = useState(true)

    // 🔁 Ambil cart dari server
    const syncCart = useCallback(async () => {
        try {
            const res = await fetch('/api/cart', {
                credentials: 'include',
            })

            if (res.status === 401) {
                setUser(false)
                setCart([])
                localStorage.removeItem('cart')
                return
            }

            const json = await res.json()
            const items = Array.isArray(json.data) ? json.data : []

            setUser(true)
            setCart(items)
            localStorage.setItem('cart', JSON.stringify(items))
        } catch (err) {
            console.error('❌ Failed to sync cart:', err)

            const cached = localStorage.getItem('cart')
            if (cached) setCart(JSON.parse(cached))
        }
    }, [])

    // 🟩 Tambahkan produk ke cart
    const addToCart = useCallback(
        async (productId: string, size: string, quantity: number) => {
            const res = await fetch('/api/cart', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, size, quantity }),
            })

            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.message || 'Failed to add to cart')
            }

            const getId = (val: unknown): string => {
                if (!val) return ''
                if (typeof val === 'string') return val
                if (typeof val === 'object') {
                    const obj = val as Record<string, unknown>
                    if (typeof obj._id === 'string') return obj._id
                    if (typeof obj.$oid === 'string') return obj.$oid
                }
                return ''
            }

            setCart((prev) => {
                if (!json.data) return prev

                const existing = prev.find(
                    (item) =>
                        getId(item.productId) === productId &&
                        item.size === json.data.size,
                )

                let updated: CartItem[]

                if (existing) {
                    updated = prev.map((item) =>
                        getId(item.productId) === productId &&
                        item.size === json.data.size
                            ? { ...item, quantity: json.data.quantity }
                            : item,
                    )
                } else {
                    updated = [...prev, json.data]
                }

                localStorage.setItem('cart', JSON.stringify(updated))

                const channel = new BroadcastChannel('cart-sync')
                channel.postMessage('cart:updated')
                channel.close()

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: json.message || 'Item added to cart',
                    timer: 2000,
                    showConfirmButton: false,
                })

                return updated
            })
        },
        [],
    )

    // 📢 Broadcast update
    const emitCartUpdate = useCallback(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
        const channel = new BroadcastChannel('cart-sync')
        channel.postMessage('cart:updated')
        channel.close()
    }, [cart])

    const clearCart = useCallback(() => {
        setCart([])
        localStorage.setItem('cart', JSON.stringify([]))

        try {
            const channel = new BroadcastChannel('cart-sync')
            channel.postMessage('cart:updated')
            channel.close()
        } catch (err) {
            console.warn('BroadcastChannel not available', err)
        }
    }, [])

    // 🌐 Online/offline
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            syncCart()
        }

        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [syncCart])

    // 🔄 Sync antar tab
    useEffect(() => {
        const channel = new BroadcastChannel('cart-sync')

        channel.onmessage = (e) => {
            if (e.data === 'cart:updated') {
                const storedCart = JSON.parse(
                    localStorage.getItem('cart') || '[]',
                )
                setCart(storedCart)
            }
        }

        return () => channel.close()
    }, [])

    // 🔐 Auth sync antar tab
    useEffect(() => {
        const authChannel = new BroadcastChannel('auth-sync')

        authChannel.onmessage = (e) => {
            if (e.data === 'auth:logout') {
                setCart([])
                localStorage.removeItem('cart')
                redirect('/')
            }

            if (e.data === 'auth:login') {
                syncCart()
            }
        }

        return () => authChannel.close()
    }, [syncCart])

    // 🧩 Initial load
    useEffect(() => {
        syncCart()
    }, [syncCart])

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                syncCart,
                addToCart,
                emitCartUpdate,
                clearCart,
                isOnline,
                user,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
