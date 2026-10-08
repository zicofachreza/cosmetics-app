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
                        Temukan
                        <span className="text-pink-400"> Kilau Alami </span>
                        Anda
                    </h1>

                    <p className="text-gray-600 mt-6 text-lg">
                        Produk perawatan kulit dan kecantikan premium yang dirancang 
                        untuk menyempurnakan kecantikan alami serta meningkatkan kepercayaan 
                        diri Anda setiap hari.
                    </p>

                    <div className="flex justify-center gap-4 mt-8">
                        <Link
                            href="/products"
                            className="bg-pink-400 text-white px-8 py-3 rounded-full hover:bg-pink-500 transition"
                        >
                            Belanja Sekarang
                        </Link>

                        <Link
                            href=""
                            className="border border-pink-400 text-pink-400 px-8 py-3 rounded-full hover:bg-gray-100 transition"
                        >
                            Produk Baru
                        </Link>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-semibold text-gray-800">
                            Produk
                        </h2>

                        <Link
                            href="/products"
                            className="text-pink-400 hover:underline"
                        >
                            Lihat Semua
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
                    <h2 className="text-3xl font-bold">Promo Kecantikan Oktober</h2>

                    <p className="mt-4 text-lg opacity-90">
                        Dapatkan diskon hingga 40% untuk produk kecantikan pilihan.
                    </p>

                    <Link
                        href="/discount"
                        className="inline-block mt-8 bg-white text-pink-400 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition"
                    >
                        Belanja Sekarang
                    </Link>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-semibold text-center text-gray-800">
                    Apa Kata Pelanggan Kami
                </h2>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {[
                        {
                            name: 'Alfi',
                            text: 'Produk perawatan kulit ini benar-benar mengubah kondisi kulit saya. Sangat direkomendasikan!',
                        },
                        {
                            name: 'Rani',
                            text: 'Kualitas makeup sangat bagus dan pengiriman cepat. Toko ini tidak mengecewakan!',
                        },
                        {
                            name: 'Riska',
                            text: 'IyahKosmetik telah menjadi tempat andalan saya untuk produk kecantikan.',
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
                        Bergabunglah dengan Komunitas Kecantikan IyahKosmetik
                    </h2>

                    <p className="text-gray-600 mt-4">
                        Dapatkan penawaran eksklusif, tips kecantikan, 
                        dan akses awal ke peluncuran produk baru.
                    </p>

                    <div className="flex mt-8 bg-white border border-pink-200 rounded-full overflow-hidden">
                        <input
                            type="email"
                            placeholder="Masukkan email Anda"
                            className="min-w-0 flex-1 px-4 sm:px-6 py-3 outline-none text-sm sm:text-base"
                        />

                        <Link
                            href=""
                            className="shrink-0 whitespace-nowrap flex items-center justify-center bg-pink-400 text-white px-4 sm:px-8 py-3 text-sm sm:text-base hover:bg-pink-500 transition"
                        >
                            Berlangganan
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
