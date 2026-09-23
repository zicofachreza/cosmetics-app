'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-pink-50 border-t border-pink-100 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="GlowBeauty"
                                width={50}
                                height={50}
                            />
                            <span className="text-lg font-semibold text-pink-400">
                                Iyah Store
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            Discover premium skincare, makeup, and beauty
                            essentials designed to help you glow with confidence
                            every day.
                        </p>

                        {/* Social */}
                        <div className="flex gap-4 mt-6">
                            <Image
                                src="/instagram.png"
                                alt="Instagram"
                                width={22}
                                height={22}
                                className="hover:opacity-70 cursor-pointer"
                            />
                            <Image
                                src="/facebook.png"
                                alt="Facebook"
                                width={22}
                                height={22}
                                className="hover:opacity-70 cursor-pointer"
                            />
                            <Image
                                src="/twitter.png"
                                alt="Twitter"
                                width={22}
                                height={22}
                                className="hover:opacity-70 cursor-pointer"
                            />
                            <Image
                                src="/youtube.png"
                                alt="Youtube"
                                width={22}
                                height={22}
                                className="hover:opacity-70 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Shop
                        </h3>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    Skincare
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    Makeup
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    Haircare
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    Fragrance
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Customer Care
                        </h3>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/orders"
                                    className="hover:text-pink-500"
                                >
                                    Order Status
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href=""
                                    className="hover:text-pink-500"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Get In Touch
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            Have questions about our products or your order? Our
                            team is here to help you.
                        </p>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                📧 support@iyahstore.com
                            </li>

                            <li className="flex items-center gap-2">
                                📞 +62 812 3456 7890
                            </li>

                            <li className="flex items-center gap-2">
                                📍 Purwokerto, Indonesia
                            </li>
                        </ul>

                        <Link
                            href=""
                            className="inline-block mt-4 text-sm text-pink-400 hover:underline"
                        >
                            Contact Support →
                        </Link>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-pink-100 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © 2026 Iyah Store. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="" className="hover:text-pink-500">
                            Privacy Policy
                        </Link>

                        <Link href="" className="hover:text-pink-500">
                            Terms of Service
                        </Link>

                        <Link href="" className="hover:text-pink-500">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
