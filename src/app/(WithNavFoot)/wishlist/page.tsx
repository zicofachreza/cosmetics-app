'use client'

export default function WishlistPage() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* HEADER */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Favorit Saya
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Produk yang Anda sukai akan muncul di sini.
                    </p>
                </div>

                {/* EMPTY WISHLIST */}
                <div className="flex justify-center my-20">
                    <p className="text-lg font-semibold text-gray-600">
                        Belum ada produk yang disukai
                    </p>
                </div>
            </div>
        </section>
    )
}
