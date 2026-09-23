'use client'

import { useState, useContext } from 'react'
import ImageGallery from '@/app/components/ImageGallery'
import idr from '@/lib/helper'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { TProduct, TSize } from '@/types/productType'
import { CartContext } from '@/app/components/CartContext'
import { useUser } from '@/app/components/UserContext'

const SizeButton = ({
    size,
    stock,
    selected,
    onSelect,
}: {
    size: string
    stock: number
    selected: boolean
    onSelect: () => void
}) => (
    <button
        disabled={stock === 0}
        onClick={() => stock > 0 && onSelect()}
        className={`w-40 py-2 rounded-lg border text-sm font-medium transition
        ${
            stock === 0
                ? 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed'
                : selected
                  ? 'bg-pink-100 border-pink-100 cursor-pointer'
                  : 'border-black hover:bg-pink-100 hover:border-pink-100 cursor-pointer'
        }`}
    >
        {size}
    </button>
)

export default function DetailClient({ product }: { product: TProduct }) {
    const [selectedSize, setSelectedSize] = useState<TSize | null>(null)
    const [sizeError, setSizeError] = useState<string>('')

    const { addToCart } = useContext(CartContext) ?? {}
    const { user } = useUser()

    const handleAddToBag = async () => {
        try {
            setSizeError('')

            if (user?.role === 'admin') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Access Denied',
                    text: 'Admin cannot add products to the shopping bag',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton:
                            'bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer',
                    },
                })
                return
            }

            if (!selectedSize) {
                setSizeError('Please select a size')
                return
            }

            if (!addToCart) throw new Error('Cart not initialized')

            await addToCart(product._id.toString(), selectedSize.size, 1)
        } catch (err: unknown) {
            const error = err as Error

            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: error.message || 'Something went wrong',
                buttonsStyling: false,
                customClass: {
                    confirmButton:
                        'bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer',
                },
            })
        }
    }

    const displayPrice = selectedSize ? selectedSize.price : product.lowestPrice

    return (
        <section className="py-16 mt-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumb */}
                <Link
                    href="/products"
                    className="text-pink-400 hover:underline text-sm"
                >
                    ← Back to All Products
                </Link>

                {/* Layout */}
                <div className="grid md:grid-cols-2 gap-10 mt-6">
                    {/* IMAGE */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <ImageGallery images={product.images} />
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        {/* Title */}
                        <h1 className="text-3xl font-semibold text-gray-800">
                            {product.name}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-gray-500 mt-2">{product.excerpt}</p>

                        {/* Price */}
                        <p className="text-2xl font-bold text-pink-400 mt-4">
                            {idr(displayPrice)}
                        </p>

                        {/* Divider */}
                        <div className="border-t my-6"></div>

                        {/* Size Selector */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-4">
                                Select Size
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((s) => (
                                    <SizeButton
                                        key={s.size}
                                        size={s.size}
                                        stock={s.stock}
                                        selected={selectedSize?.size === s.size}
                                        onSelect={() => {
                                            setSelectedSize(s)
                                            setSizeError('')
                                        }}
                                    />
                                ))}
                            </div>

                            {sizeError && (
                                <p className="text-red-500 font-semibold text-sm mt-2">
                                    {sizeError}
                                </p>
                            )}
                        </div>

                        {/* Add To Cart */}
                        <button
                            onClick={handleAddToBag}
                            className="w-full mt-8 bg-pink-400 text-white py-3 rounded-full font-semibold hover:bg-pink-500 transition cursor-pointer"
                        >
                            Add to Bag
                        </button>

                        {/* Product Description */}
                        <div className="mt-10">
                            <h3 className="font-semibold text-gray-800 mb-2 mt-4">
                                Product Description
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        
                    </div>
                </div>
            </div>
        </section>
    )
}
