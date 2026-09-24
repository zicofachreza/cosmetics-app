import { NextResponse } from 'next/server'
import ProductModel from '@/models/product'
import { ProductPayload } from '@/types/productType'
import { authorizeAdmin } from '@/lib/authorization'

/**
 * GET
 * Get product detail
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const auth = await authorizeAdmin()

        if (auth.error) return auth.error

        const { id } = await params

        const product = await ProductModel.findById(id)

        if (!product) {
            return NextResponse.json(
                {
                    message: 'Product not found',
                },
                {
                    status: 404,
                },
            )
        }

        return NextResponse.json({
            data: product,
        })
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

/**
 * PUT
 * Update product
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const auth = await authorizeAdmin()

        if (auth.error) return auth.error

        const { id } = await params

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

        const product = await ProductModel.findById(id)

        if (!product) {
            return NextResponse.json(
                {
                    message: 'Product not found',
                },
                {
                    status: 404,
                },
            )
        }

        const result = await ProductModel.updateProduct(id, body)

        if (!result.modifiedCount) {
            return NextResponse.json({
                message: 'No changes were made',
            })
        }

        return NextResponse.json({
            message: 'Your changes have been saved successfully',
        })
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

/**
 * DELETE
 * Delete product
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const auth = await authorizeAdmin()

        if (auth.error) return auth.error

        const { id } = await params

        const result = await ProductModel.deleteProduct(id)

        if (result.deletedCount === 0) {
            return NextResponse.json(
                {
                    message: 'Product not found',
                },
                {
                    status: 404,
                },
            )
        }

        return NextResponse.json({
            message: 'The product has been permanently removed',
        })
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
