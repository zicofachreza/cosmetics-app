'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type User = {
    id: string
    name: string
    email: string
    role: 'user' | 'admin'
} | null

type UserContextType = {
    user: User
    setUser: React.Dispatch<React.SetStateAction<User>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null)
    const [loading, setLoading] = useState<boolean>(true)

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error('useUser must be used inside UserProvider')
    }

    return context
}