import idr from '@/lib/helper'
import ProductModel from '@/models/product'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
    const data = await ProductModel.getSliceProducts()
    const limitedData = data.slice(0, 4)

    return (
        <div>
            {/* HERO */}
            <section className="bg-pink-100 min-h-screen flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight">
                        Discover Your
                        <span className="text-pink-400"> Natural Glow</span>
                    </h1>

                    <p className="text-gray-600 mt-6 text-lg">
                        Premium skincare and beauty essentials designed to
                        enhance your natural beauty and confidence every day.
                    </p>

                    <div className="flex justify-center gap-4 mt-8">
                        <Link
                            href="/products"
                            className="bg-pink-400 text-white px-8 py-3 rounded-full hover:bg-pink-500 transition"
                        >
                            Shop Now
                        </Link>

                        <Link
                            href=""
                            className="border border-pink-400 text-pink-400 px-8 py-3 rounded-full hover:bg-gray-100 transition"
                        >
                            New Arrivals
                        </Link>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-semibold text-gray-800">
                            Featured Products
                        </h2>

                        <Link
                            href="/products"
                            className="text-pink-400 hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {limitedData.map((product) => (
                            <div
                                key={product._id.toString()}
                                className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition overflow-hidden"
                            >
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

                                <Link href={`/products/${product.slug}`}>
                                    <div className="p-4">
                                        <h3 className="text-gray-800 font-medium">
                                            {product.name}
                                        </h3>

                                        <p className="text-pink-400 font-semibold mt-1">
                                            {idr(product.lowestPrice)}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROMO */}
            <section className="bg-pink-400 text-white py-20">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold">Summer Beauty Sale</h2>

                    <p className="mt-4 text-lg opacity-90">
                        Get up to 40% off on selected beauty products.
                    </p>

                    <Link
                        href=""
                        className="inline-block mt-8 bg-white text-pink-400 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition"
                    >
                        Shop the Sale
                    </Link>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-semibold text-center text-gray-800">
                    What Our Customers Say
                </h2>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {[
                        {
                            name: 'Sophia',
                            text: 'The skincare products completely transformed my skin. Highly recommended!',
                        },
                        {
                            name: 'Emma',
                            text: 'Amazing quality makeup and fast shipping. I love this store!',
                        },
                        {
                            name: 'Olivia',
                            text: 'GlowBeauty has become my go-to place for beauty products.',
                        },
                    ].map((review, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
                        >
                            <p className="text-gray-600 italic">
                                "{review.text}"
                            </p>

                            <h4 className="mt-4 font-semibold text-pink-400">
                                {review.name}
                            </h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* NEWSLETTER CTA */}
            <section className="bg-pink-50 py-20">
                <div className="max-w-3xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Join Our Beauty Community
                    </h2>

                    <p className="text-gray-600 mt-4">
                        Get exclusive offers, beauty tips, and early access to
                        new product launches.
                    </p>

                    <div className="flex mt-8 bg-white border border-pink-200 rounded-full overflow-hidden">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-3 outline-none"
                        />

                        <Link
                            href=""
                            className="flex items-center bg-pink-400 text-white px-8 hover:bg-pink-500 transition"
                        >
                            Subscribe
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
