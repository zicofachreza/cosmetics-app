'use client'

import { Props } from '@/types/userType'
import { redirect } from 'next/navigation'

export default function LogoutButton({ onLogout }: Props) {
    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' })
        onLogout?.()
        redirect('/')
    }

    return (
        <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 cursor-pointer"
        >
            Sign Out
        </button>
    )
}
