'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import LogoutButton from './LogoutBotton'
import { motion, AnimatePresence } from 'framer-motion'
import { UserMenuProps } from '@/types/userType'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function UserMenu({ userName, role, onLogout }: UserMenuProps) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 hover:underline focus:outline-none cursor-pointer"
            >
                <span className="hidden sm:inline text-sm text-gray-700 font-medium">
                    Hi, {userName.split(' ')[0]}
                </span>
                <Image src="/user-icon.png" alt="User" width={24} height={24} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-44 bg-white shadow-xl border border-gray-100 rounded-2xl py-2 z-50"
                    >
                        {role !== 'admin' && (
                            <Link
                                href="/orders"
                                onClick={() => setOpen(false)}
                                className={`block w-full px-4 py-2 text-sm font-medium transition-colors ${
                                    pathname.startsWith('/orders')
                                        ? 'bg-gray-100'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                My Orders
                            </Link>
                        )}

                        {role === 'admin' && (
                            <>
                                <Link
                                    href="/admin/catalogs"
                                    onClick={() => setOpen(false)}
                                    className={`block w-full px-4 py-2 text-sm font-medium transition-colors ${
                                        pathname.startsWith('/admin/catalogs')
                                            ? 'bg-gray-100'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Catalog
                                </Link>

                                <Link
                                    href="/admin/orders"
                                    onClick={() => setOpen(false)}
                                    className={`block w-full px-4 py-2 text-sm font-medium transition-colors ${
                                        pathname.startsWith('/admin/orders')
                                            ? 'bg-gray-100'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Orders
                                </Link>

                                <Link
                                    href="/admin/reports"
                                    onClick={() => setOpen(false)}
                                    className={`block w-full px-4 py-2 text-sm font-medium transition-colors ${
                                        pathname === '/admin/reports'
                                            ? 'bg-gray-100'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Reports
                                </Link>
                            </>
                        )}

                        <LogoutButton onLogout={onLogout} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
