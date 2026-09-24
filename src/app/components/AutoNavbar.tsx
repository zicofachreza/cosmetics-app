'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import UserMenu from './UserMenu'
import { CartContext } from './CartContext'
import { useUser } from './UserContext'

export default function AutoNavbar({ initialAuth }: { initialAuth: boolean }) {
    const [show, setShow] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [authorized, setAuthorized] = useState(initialAuth)
    const { user, setUser } = useUser()

    const cartCtx = useContext(CartContext)
    const cartCount =
        cartCtx?.cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            setShow(!(currentScrollY > lastScrollY && currentScrollY > 80))
            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    useEffect(() => {
        if (!initialAuth) {
            setAuthorized(false)
            setUser(null)
            return
        }

        let cancelled = false

        const fetchUser = async () => {
            try {
                const res = await fetch('/api/me', {
                    credentials: 'include',
                    cache: 'no-store',
                })

                const data = await res.json()

                if (cancelled) return

                if (res.ok && data.ok) {
                    setUser({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        role: data.role,
                    })

                    setAuthorized(true)
                } else {
                    setAuthorized(false)
                    setUser(null)
                }
            } catch (err) {
                if (cancelled) return

                console.error('❌ Error fetching user:', err)
                setAuthorized(false)
                setUser(null)
            }
        }

        fetchUser()

        return () => {
            cancelled = true
        }
    }, [initialAuth, setUser])

    // 🔁 Dengarkan perubahan auth antar-tab
    useEffect(() => {
        const authChannel = new BroadcastChannel('auth-sync')
        authChannel.onmessage = (e) => {
            if (e.data === 'auth:login') {
                setAuthorized(true)
            } else if (e.data === 'auth:logout') {
                setAuthorized(false)
                setUser(null)
            }
        }
        return () => authChannel.close()
    }, [])

    const handleLogout = async () => {
        localStorage.removeItem('accessToken')
        setAuthorized(false)
        setUser(null)
        window.dispatchEvent(new Event('auth:logout'))
        new BroadcastChannel('auth-sync').postMessage('auth:logout')
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-pink-100 z-50 transition-transform duration-300 ${
                show ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* Announcement Bar */}
            <div className="bg-pink-50 text-center text-sm py-2 text-pink-700 font-medium">
                ✨ Free Shipping for Orders Above Rp 500.000
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Cosmetics"
                        width={50}
                        height={50}
                    />
                    <span className="font-semibold text-lg text-pink-400">
                        Iyah Store
                    </span>
                </Link>

                {/* Menu */}
                <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-700">
                    <li>
                        <Link
                            href="/products"
                            className="relative hover:text-pink-500 transition group"
                        >
                            Products
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all group-hover:w-full"></span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href=""
                            className="relative hover:text-pink-500 transition group"
                        >
                            New Arrivals
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all group-hover:w-full"></span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href=""
                            className="relative hover:text-pink-500 transition group"
                        >
                            Sale
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all group-hover:w-full"></span>
                        </Link>
                    </li>
                </ul>

                {/* Right Section */}
                <div className="flex items-center gap-5">
                    {/* Wishlist */}
                    <Link href="" className="relative">
                        <Image
                            src="/heart-outline.png"
                            alt="Wishlist"
                            width={22}
                            height={22}
                        />
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" className="relative">
                        <Image
                            src="/bag.png"
                            alt="Cart"
                            width={22}
                            height={22}
                        />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Login */}
                    {authorized ? (
                        <UserMenu
                            userName={user?.name ?? ''}
                            role={user?.role ?? 'user'}
                            onLogout={handleLogout}
                        />
                    ) : (
                        <Link
                            href="/login"
                            className="hidden md:block bg-pink-400 hover:bg-pink-500 text-white text-sm px-5 py-2 rounded-lg transition"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
