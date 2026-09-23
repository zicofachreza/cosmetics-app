import ProductModel from '@/models/product'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const { data } = await ProductModel.getProductBySlug(slug)

        if (!data) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            )
        }
        
        return NextResponse.json({ data }, { status: 200 })
    } catch (err: unknown) {
        const error = err as Error
        console.error(error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
