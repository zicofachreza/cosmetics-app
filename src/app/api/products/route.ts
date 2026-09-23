import ProductModel from '@/models/product'
import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '8', 10)
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || ''

    try {
        const { data } = await ProductModel.getAllProducts(
            page,
            limit,
            category,
            sort
        )

        if (!data || data.length === 0) {
            return NextResponse.json(
                { message: 'Product not found', data: [] },
                { status: 404 }
            )
        }

        return NextResponse.json({ data }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}