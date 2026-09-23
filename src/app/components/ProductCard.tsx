import Image from 'next/image'
import Link from 'next/link'
import idr from '@/lib/helper'
import { CardProps } from '@/types/productType'

export default function ProductCard({ product }: { product: CardProps }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition overflow-hidden">
            {/* IMAGE */}
            <Link href={`/products/${product.slug}`}>
                <div className="relative h-48">
                    <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>

            {/* INFO */}
            <Link href={`/products/${product.slug}`}>
                <div className="p-4">
                    <h3 className="text-gray-800 font-medium group-hover:text-pink-400 transition">
                        {product.name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {product.excerpt ||
                            'Premium beauty product for your daily routine.'}
                    </p>

                    <p className="text-pink-400 font-semibold mt-2">
                        {idr(product.lowestPrice)}
                    </p>
                </div>
            </Link>
        </div>
    )
}
