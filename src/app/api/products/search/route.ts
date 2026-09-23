import { NextRequest, NextResponse } from 'next/server'
import ProductModel from '@/models/product'

export async function GET(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams.get('search') || ''
        const { data: products } = await ProductModel.searchProducts(query)

        if (!products || products.length === 0) {
            return NextResponse.json(
                { message: 'Product not found', data: [] },
                { status: 404 },
            )
        }

        return NextResponse.json({ data: products }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 },
        )
    }
}
