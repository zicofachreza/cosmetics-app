import { NextResponse } from 'next/server'
import ProductModel from '@/models/product'
import { ProductPayload } from '@/types/productType'
import { authorizeAdmin } from '@/lib/authorization'

export async function GET(request: Request) {
    try {
        const auth = await authorizeAdmin()

        if (auth.error) return auth.error

        const { searchParams } = new URL(request.url)

        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 10

        const category = searchParams.get('category') || ''
        const sort = searchParams.get('sort') || ''

        const result = await ProductModel.getAllProductsAdmin(
            page,
            limit,
            category,
            sort,
        )

        return NextResponse.json(
            {
                data: result.data,
                total: result.total,
                totalPages: result.totalPages,
                page,
            },
            {
                status: 200,
            },
        )
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            {
                message: 'Internal server error',
            },
            {
                status: 500,
            },
        )
    }
}

export async function POST(request: Request) {
    try {
        const auth = await authorizeAdmin()

        if (auth.error) return auth.error

        const body: ProductPayload = await request.json()

        if (
            !body.name ||
            !body.slug ||
            !body.description ||
            !body.excerpt ||
            !body.category ||
            !body.thumbnail
        ) {
            return NextResponse.json(
                {
                    message: 'Please complete all required fields',
                },
                {
                    status: 400,
                },
            )
        }

        if (!Array.isArray(body.images)) {
            return NextResponse.json(
                {
                    message: 'Images must be an array',
                },
                {
                    status: 400,
                },
            )
        }

        if (!Array.isArray(body.tags)) {
            return NextResponse.json(
                {
                    message: 'Tags must be an array',
                },
                {
                    status: 400,
                },
            )
        }

        if (!Array.isArray(body.sizes) || body.sizes.length === 0) {
            return NextResponse.json(
                {
                    message: 'At least one size is required',
                },
                {
                    status: 400,
                },
            )
        }

        for (const size of body.sizes) {
            if (
                !size.size ||
                typeof size.price !== 'number' ||
                typeof size.stock !== 'number'
            ) {
                return NextResponse.json(
                    {
                        message: 'Invalid size data',
                    },
                    {
                        status: 400,
                    },
                )
            }

            if (size.price < 0 || size.stock < 0) {
                return NextResponse.json(
                    {
                        message: 'Price and stock cannot be negative',
                    },
                    {
                        status: 400,
                    },
                )
            }
        }

        await ProductModel.createProduct(body)

        return NextResponse.json(
            {
                message:
                    'The product has been added successfully',
            },
            {
                status: 201,
            },
        )
    } catch (error) {
        console.error(error)

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status: 400,
                },
            )
        }

        return NextResponse.json(
            {
                message: 'Internal server error',
            },
            {
                status: 500,
            },
        )
    }
}