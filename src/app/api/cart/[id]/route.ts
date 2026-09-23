import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import CartModel from '@/models/cart'
import ProductModel from '@/models/product'

// ✅ Update quantity
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const userId = await getUserId()
        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { quantity, size } = await req.json()

        if (!quantity || !size) {
            return NextResponse.json(
                { message: 'Quantity and size are required' },
                { status: 400 }
            )
        }

        const productId = new ObjectId(id)

        // cek product di DB
        const product = await ProductModel.findById(productId)
        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            )
        }

        const sizeData = await ProductModel.findSize(product, size)
        if (!sizeData) {
            return NextResponse.json(
                { message: `Size ${size} not found` },
                { status: 404 }
            )
        }

        // ❌ Kalau stok tidak cukup
        if (quantity > sizeData.stock) {
            return NextResponse.json(
                { message: `Out of stock` },
                { status: 400 }
            )
        }

        // ✅ update cart via model
        const result = await CartModel.updateQuantityByProduct(
            userId,
            productId,
            size,
            quantity
        )

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { message: 'Cart item not found or not updated' },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: 'Cart updated successfully' })
    } catch (error) {
        console.error('❌ PUT /api/cart/[id] error:', error)
        return NextResponse.json(
            { message: 'Failed to update cart', error: String(error) },
            { status: 500 }
        )
    }
}
