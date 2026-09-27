'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import UserMenu from './UserMenu'
import { CartContext } from './CartContext'
import { useUser } from './UserContext'

type AutoNavbarProps = {
    initialAuth: boolean
}

export default function AutoNavbar({ initialAuth }: AutoNavbarProps) {
    const [show, setShow] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [authorized, setAuthorized] = useState(initialAuth)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const { user, setUser } = useUser()

    const cartCtx = useContext(CartContext)

    const cartCount =
        cartCtx?.cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

    // =========================
    // Navbar scroll behavior
    // =========================
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            setShow(
                !(currentScrollY > lastScrollY && currentScrollY > 80)
            )

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY])

    // =========================
    // Get current user
    // =========================
    useEffect(() => {
        if (!initialAuth) {
            setAuthorized(false)
            setUser(null)
            return
        }

        const fetchUser = async () => {
            try {
                const res = await fetch('/api/me', {
                    credentials: 'include',
                    cache: 'no-store',
                })

                const data = await res.json()

                if (res.ok && data.ok) {
                    setUser({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        role: data.role,
                    })

                    setAuthorized(true)
                } else {
                    setUser(null)
                    setAuthorized(false)
                }
            } catch (error) {
                console.error('Error fetching user:', error)

                setUser(null)
                setAuthorized(false)
            }
        }

        fetchUser()
    }, [initialAuth, setUser])

    // =========================
    // Sync authentication
    // between browser tabs
    // =========================
    useEffect(() => {
        const authChannel = new BroadcastChannel('auth-sync')

        authChannel.onmessage = (event) => {
            if (event.data === 'auth:login') {
                window.location.reload()
            }

            if (event.data === 'auth:logout') {
                setAuthorized(false)
                setUser(null)
            }
        }

        return () => {
            authChannel.close()
        }
    }, [setUser])

    // =========================
    // Logout
    // =========================
    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            })

            if (!res.ok) {
                console.error('Logout failed')
                return
            }

            setAuthorized(false)
            setUser(null)
            setMobileMenuOpen(false)

            const authChannel = new BroadcastChannel('auth-sync')

            authChannel.postMessage('auth:logout')

            authChannel.close()

            window.location.href = '/'
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // =========================
    // Close mobile menu
    // =========================
    const closeMobileMenu = () => {
        setMobileMenuOpen(false)
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-pink-100 z-50 transition-transform duration-300 ${
                show ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* =========================
                Announcement Bar
            ========================= */}
            <div className="bg-pink-50 text-center text-sm py-2 text-pink-700 font-medium">
                ✨ Free Shipping for Orders Above Rp 500.000
            </div>

            {/* =========================
                Main Navbar
            ========================= */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={closeMobileMenu}
                >
                    <Image
                        src="/ik_logo_2.png"
                        alt="Cosmetics"
                        width={90}
                        height={90}
                    />
                </Link>

                {/* =========================
                    Desktop Menu
                ========================= */}
                <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-700">
                    <li>
                        <Link
                            href="/products"
                            className="relative hover:text-pink-500 transition group"
                        >
                            Products

                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all group-hover:w-full" />
                        </Link>
                    </li>

                    <li>
                        <Link
                            href=""
                            className="relative hover:text-pink-500 transition group"
                        >
                            New Arrivals

                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all group-hover:w-full" />
                        </Link>
                    </li>

                    <li>
                        <Link
                            href=""
                            className="relative hover:text-pink-500 transition group"
                        >
                            Sale

                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all group-hover:w-full" />
                        </Link>
                    </li>
                </ul>

                {/* =========================
                    Right Section
                ========================= */}
                <div className="flex items-center gap-5">
                    {/* Wishlist */}
                    <Link
                        href=""
                        onClick={closeMobileMenu}
                        className="relative"
                    >
                        <Image
                            src="/heart-outline.png"
                            alt="Wishlist"
                            width={22}
                            height={22}
                        />
                    </Link>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative"
                        onClick={closeMobileMenu}
                    >
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

                    {/* =========================
                        Desktop User / Login
                    ========================= */}
                    <div className="hidden md:block">
                        {authorized ? (
                            <UserMenu
                                userName={user?.name ?? ''}
                                role={user?.role ?? 'user'}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <Link
                                href="/login"
                                className="bg-pink-400 hover:bg-pink-500 text-white text-sm px-5 py-2 rounded-lg transition"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* =========================
                        Mobile Hamburger
                    ========================= */}
                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen((prev) => !prev)
                        }
                        className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
                        aria-label="Toggle mobile menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span
                            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
                                mobileMenuOpen
                                    ? 'translate-y-2 rotate-45'
                                    : ''
                            }`}
                        />

                        <span
                            className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${
                                mobileMenuOpen
                                    ? 'opacity-0'
                                    : 'opacity-100'
                            }`}
                        />

                        <span
                            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
                                mobileMenuOpen
                                    ? '-translate-y-2 -rotate-45'
                                    : ''
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* =========================
                Mobile Dropdown Menu
            ========================= */}
            <div
                className={`md:hidden overflow-hidden border-t border-pink-100 bg-white transition-all duration-300 ${
                    mobileMenuOpen
                        ? 'max-h-[700px] opacity-100'
                        : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-6 py-5 space-y-1">
                    {/* Products */}
                    <Link
                        href="/products"
                        onClick={closeMobileMenu}
                        className="block py-3 text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 px-3 rounded-lg transition"
                    >
                        Products
                    </Link>

                    {/* New Arrivals */}
                    <Link
                        href=""
                        onClick={closeMobileMenu}
                        className="block py-3 text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 px-3 rounded-lg transition"
                    >
                        New Arrivals
                    </Link>

                    {/* Sale */}
                    <Link
                        href=""
                        onClick={closeMobileMenu}
                        className="block py-3 text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 px-3 rounded-lg transition"
                    >
                        Sale
                    </Link>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-2" />

                    {/* =========================
                        MOBILE USER SECTION
                    ========================= */}
                    {authorized ? (
                        <div className="px-3 py-2">
                            {/* User Information */}
                            <div className="flex items-center gap-3 py-3">
                                <Image
                                    src="/user-icon.png"
                                    alt="User"
                                    width={28}
                                    height={28}
                                />

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        Hi,{' '}
                                        {user?.name?.split(' ')[0] ??
                                            'User'}
                                    </p>

                                    <p className="text-xs text-gray-500 capitalize">
                                        {user?.role === 'admin'
                                            ? 'Administrator'
                                            : 'Customer'}
                                    </p>
                                </div>
                            </div>

                            {/* =========================
                                User Menu
                            ========================= */}
                            <div className="space-y-1">
                                {/* Regular User */}
                                {user?.role !== 'admin' && (
                                    <Link
                                        href="/orders"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-3 py-3 text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition"
                                    >
                                        My Orders
                                    </Link>
                                )}

                                {/* Admin */}
                                {user?.role === 'admin' && (
                                    <>
                                        <Link
                                            href="/admin/catalogs"
                                            onClick={closeMobileMenu}
                                            className="block w-full px-3 py-3 text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition"
                                        >
                                            Catalog
                                        </Link>

                                        <Link
                                            href="/admin/orders"
                                            onClick={closeMobileMenu}
                                            className="block w-full px-3 py-3 text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition"
                                        >
                                            Orders
                                        </Link>

                                        <Link
                                            href="/admin/reports"
                                            onClick={closeMobileMenu}
                                            className="block w-full px-3 py-3 text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition"
                                        >
                                            Reports
                                        </Link>
                                    </>
                                )}

                                {/* Logout */}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* =========================
                           MOBILE SIGN IN
                        ========================= */
                        <Link
                            href="/login"
                            onClick={closeMobileMenu}
                            className="block text-center bg-pink-400 hover:bg-pink-500 text-white text-sm font-medium px-5 py-3 rounded-lg transition"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}