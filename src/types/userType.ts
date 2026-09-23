import { ObjectId } from 'mongodb'

export type TUser = {
    _id?: ObjectId
    name?: string
    username: string
    email: string
    password: string
    role?: 'user' | 'admin'
}

export type NewUserInput = Omit<TUser, '_id'>

export type LoginInput = {
    email: string
    password: string
}

export type Props = {
    onLogout?: () => void
    className?: string
}

export type PageProps = {
    searchParams: Promise<{ ok?: 'false' | 'true'; message?: string }>
}

export interface FormData {
    name: string
    username: string
    email: string
    password: string
}

export interface ErrorMessages {
    name?: string
    username?: string
    email?: string
    password?: string
    general?: string
}

export interface JWTPayload {
    _id: string
    email: string
    name: string
    role?: 'user' | 'admin'
}

export interface UserMenuProps {
    userName: string
    role: 'user' | 'admin'
    onLogout: () => void
}

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  address: string
  phone: string
}
