import ProductForm from '@/app/components/admin/ProductForm'
import ProductModel from '@/models/product'
import { notFound } from 'next/navigation'
import { TProduct } from '@/types/productType'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
    params: Promise<{
        id: string
    }>
}

export default async function EditProductPage({ params }: Props) {
    const { id } = await params

    const product = await ProductModel.findById(id)

    if (!product) {
        notFound()
    }

    const productData: TProduct = product

    return (
        <section className="py-20">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Edit Product
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Update your product information
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
                    <ProductForm
                        mode="edit"
                        initialData={{
                            _id: productData._id.toString(),
                            name: productData.name,
                            slug: productData.slug,
                            category: productData.category,
                            excerpt: productData.excerpt,
                            description: productData.description,
                            thumbnail: productData.thumbnail,
                            images: productData.images,
                            tags: productData.tags,
                            sizes: productData.sizes,
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
