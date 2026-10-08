'use client'

export default function DiscountPage() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* HEADER */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Diskon
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Temukan berbagai produk dengan harga spesial untuk Anda.
                    </p>
                </div>

                {/* EMPTY DISCOUNT PRODUCTS */}
                <div className="flex justify-center my-20">
                    <p className="text-lg font-semibold text-gray-600">
                        Belum ada produk diskon
                    </p>
                </div>
            </div>
        </section>
    )
}