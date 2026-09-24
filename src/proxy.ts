import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function proxy(request: NextRequest) {
    const auth = request.cookies.get('Authorization')
    const pathname = request.nextUrl.pathname

    if (!auth) {
        if (
            pathname.startsWith('/cart') ||
            pathname.startsWith('/orders') ||
            pathname.startsWith('/checkout')
        ) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }

    const token = auth.value.split(' ')[1]
    const decoded = jwt.decode(token) as any

    // 🔥 ADMIN ONLY PAGE
    if (pathname.startsWith('/admin/reports')) {
        if (decoded?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // redirect login kalau sudah login
    if (pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/products/:path*',
        '/login',
        '/cart',
        '/orders',
        '/checkout',
        '/reports',
    ],
}
