'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductForm from '@/app/components/admin/ProductForm'

export default function AddProductPage() {
    return (
        <section className="py-20">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Add Product
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Create a new product for your catalog
                        </p>
                    </div>

                    <Link
                        href="/admin/catalogs"
                        className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <ProductForm mode="create" />
                </div>
            </div>
        </section>
    )
}