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
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null)

    return (
        <UserContext.Provider value={{ user, setUser }}>
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