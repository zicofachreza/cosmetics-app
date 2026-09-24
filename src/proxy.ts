import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function proxy(request: NextRequest) {
    const auth = request.cookies.get('Authorization')
    const pathname = request.nextUrl.pathname

    if (!auth) {
        if (
            pathname.startsWith('/admin/reports') ||
            pathname.startsWith('/admin/orders') ||
            pathname.startsWith('/admin/catalog')
        ) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        if (
            pathname.startsWith('/cart') ||
            pathname.startsWith('/orders') ||
            pathname.startsWith('/checkout')
        ) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }

    const token = auth.value.startsWith('Bearer ')
        ? auth.value.split(' ')[1]
        : auth.value

    const decoded = jwt.decode(token) as {
        role?: string
    } | null

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
        '/orders/:path*',
        '/checkout',
        '/admin/reports',
        '/admin/orders/:path*',
        '/admin/catalog/:path*',
    ],
}
