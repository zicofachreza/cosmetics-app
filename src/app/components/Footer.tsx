'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-pink-50 border-t border-pink-100 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-30">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/ik_logo_2.png"
                                alt="GlowBeauty"
                                width={100}
                                height={100}
                            />
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            Temukan produk perawatan kulit, makeup, dan kebutuhan 
                            kecantikan premium yang dirancang untuk membantu Anda 
                            tampil memesona dan penuh percaya diri setiap hari.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Toko
                        </h3>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/newArrivals"
                                    className="hover:text-pink-500"
                                >
                                    Produk Baru
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/discount"
                                    className="hover:text-pink-500"
                                >
                                    Diskon
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/wishlist"
                                    className="hover:text-pink-500"
                                >
                                    Favorit Saya
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/orders"
                                    className="hover:text-pink-500"
                                >
                                    Pesanan Saya
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Hubungi Kami
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            Ada pertanyaan mengenai produk atau pesanan Anda? 
                            Tim kami siap membantu Anda.
                        </p>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                📧 grosircosme19@gmail.com
                            </li>

                            <li className="flex items-center gap-2">
                                📞 +62 856 4768 0739
                            </li>

                            <li className="flex items-center gap-2">
                                📍 Kebasen, Kabupaten Banyumas
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-pink-100 mt-12 pt-6 flex items-center justify-center">
                    <p className="text-sm text-gray-500">
                        © 2026 IyahKosmetik. Hak cipta dilindungi undang-undang.
                    </p>
                </div>
            </div>
        </footer>
    )
}
