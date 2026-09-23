import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import ProductModel from '@/models/product'
import CartModel from '@/models/cart'

// ✅ GET /api/cart — Ambil seluruh cart user
export async function GET() {
    try {
        const userId = await getUserId()
        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized', data: [] },
                { status: 401 }
            )
        }

        const carts = await CartModel.findAllByUserId(userId)
        return NextResponse.json({
            message: 'Cart fetched successfully',
            data: carts,
        })
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to fetch cart', error: String(error), data: [] },
            { status: 500 }
        )
    }
}

// ✅ POST /api/cart — Tambahkan atau update item di cart
export async function POST(req: Request) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return NextResponse.json(
                { message: 'Please log in to add items to your bag' },
                { status: 401 }
            )
        }

        const { productId, size, quantity } = await req.json()
        if (!productId || !size) {
            return NextResponse.json(
                { message: 'Please select a size' },
                { status: 400 }
            )
        }

        const qty = Number(quantity) || 0
        if (qty === 0) {
            return NextResponse.json(
                { message: 'Quantity must not be 0' },
                { status: 400 }
            )
        }

        // 🧩 Cek produk
        const product = await ProductModel.findById(productId)
        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            )
        }

        // 🧩 Cek ukuran produk
        const sizeData = await ProductModel.findSize(product, size)
        if (!sizeData) {
            return NextResponse.json(
                { message: `Size ${size} not found` },
                { status: 404 }
            )
        }

        // 🔍 Cek apakah item sudah ada di cart
        const existingItem = await CartModel.findByUserProductSize(
            userId,
            productId,
            size
        )

        let newQty = qty
        if (existingItem) {
            newQty = existingItem.quantity + qty
        }

        // ❌ Jika stok tidak cukup
        if (newQty > sizeData.stock) {
            return NextResponse.json(
                { message: `Out of stock for size ${size}` },
                { status: 400 }
            )
        }

        let finalItem

        if (existingItem) {
            // 🔧 Update quantity
            await CartModel.updateQuantity(existingItem._id, newQty)

            // 🔁 Ambil ulang data cart item lengkap (dengan lookup product)
            const updated = await CartModel.findByUserProductSize(
                userId,
                productId,
                size
            )

            finalItem = updated
        } else {
            // 🆕 Insert item baru
            await CartModel.insertItem({
                userId: new ObjectId(userId),
                productId: new ObjectId(productId),
                size,
                quantity: newQty,
            })

            // 🔁 Ambil ulang item yang baru dimasukkan
            const inserted = await CartModel.findByUserProductSize(
                userId,
                productId,
                size
            )

            finalItem = inserted
        }

        return NextResponse.json({
            message: existingItem
                ? 'Quantity updated in bag'
                : 'Product added to bag successfully',
            data: finalItem, // ✅ sekarang frontend dapat item lengkap
        })
    } catch (error) {
        console.error('❌ Error in POST /api/cart:', error)
        return NextResponse.json(
            { message: 'Failed to add to bag', error: String(error) },
            { status: 500 }
        )
    }
}

// ✅ DELETE /api/cart — Hapus item dari cart
export async function DELETE(req: Request) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { productId, size } = await req.json()
        if (!productId || !size) {
            return NextResponse.json(
                { message: 'ProductId and size are required' },
                { status: 400 }
            )
        }

        await CartModel.deleteItem(userId, productId, size)

        return NextResponse.json({ message: 'Item removed from bag' })
    } catch (error) {
        console.error('❌ Error in DELETE /api/cart:', error)
        return NextResponse.json(
            { message: 'Failed to remove from bag', error: String(error) },
            { status: 500 }
        )
    }
}
