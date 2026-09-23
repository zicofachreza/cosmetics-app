'use client'

import { useState, ChangeEvent } from 'react'
import { ProductFormProps, TSize } from '@/types/productType'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Trash2 } from 'lucide-react'

export default function ProductForm({ mode, initialData }: ProductFormProps) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [name, setName] = useState(initialData?.name ?? '')

    const [slug, setSlug] = useState(initialData?.slug ?? '')

    const [category, setCategory] = useState(initialData?.category ?? '')

    const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')

    const [description, setDescription] = useState(
        initialData?.description ?? '',
    )

    const [thumbnail, setThumbnail] = useState(initialData?.thumbnail ?? '')

    const [images, setImages] = useState<string[]>(
        initialData?.images?.length ? initialData.images : [''],
    )

    const [tags, setTags] = useState(initialData?.tags.join(', ') ?? '')

    const [sizes, setSizes] = useState<TSize[]>(
        initialData?.sizes?.length
            ? initialData.sizes
            : [
                  {
                      size: '',
                      price: 0,
                      stock: 0,
                  },
              ],
    )

    /* ==========================
       Helpers
    ========================== */

    const generateSlug = (value: string) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
    }

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        setName(value)

        if (mode === 'create') {
            setSlug(generateSlug(value))
        }
    }

    /* ==========================
       Images
    ========================== */

    const handleImageChange = (index: number, value: string) => {
        const copy = [...images]

        copy[index] = value

        setImages(copy)
    }

    const addImage = () => {
        setImages([...images, ''])
    }

    const removeImage = (index: number) => {
        if (images.length === 1) return

        setImages(images.filter((_, i) => i !== index))
    }

    /* ==========================
       Sizes
    ========================== */

    const handleSizeChange = (
        index: number,
        field: keyof TSize,
        value: string | number,
    ) => {
        const copy = [...sizes]

        copy[index] = {
            ...copy[index],
            [field]:
                field === 'price' || field === 'stock' ? Number(value) : value,
        }

        setSizes(copy)
    }

    const addSize = () => {
        setSizes([
            ...sizes,
            {
                size: '',
                price: 0,
                stock: 0,
            },
        ])
    }

    const removeSize = (index: number) => {
        if (sizes.length === 1) return

        setSizes(sizes.filter((_, i) => i !== index))
    }

    /* ==========================
       Submit
    ========================== */

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        try {
            const payload = {
                name,
                slug,
                category,
                excerpt,
                description,
                thumbnail,
                images: images.filter((img) => img.trim() !== ''),
                tags: tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                sizes,
            }

            const url =
                mode === 'create'
                    ? '/api/admin/products'
                    : `/api/admin/products/${initialData!._id}`

            const method = mode === 'create' ? 'POST' : 'PUT'

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.message)
            }

            await Swal.fire({
                icon: 'success',
                title:
                    mode === 'create' ? 'Product Created' : 'Product Updated',
                text: result.message,
                timer: 2000,
                showConfirmButton: false,
            })

            router.push('/admin/catalogs')
            router.refresh()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text:
                    error instanceof Error
                        ? error.message
                        : 'Something went wrong',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* ==========================
            Product Information
        ========================== */}
            <div className="bg-gray-50 rounded-2xl p-6 border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Product Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Originote Ceracinamide Sunscreen"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug
                        </label>

                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="originote-ceracinamide-sunscreen"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Makeup">Makeup</option>
                            <option value="Skincare">Skincare</option>
                            <option value="Haircare">Haircare</option>
                            <option value="Bodycare">Bodycare</option>
                        </select>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Excerpt
                        </label>

                        <input
                            type="text"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Short description"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>

                        <textarea
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write the complete product description"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* ==========================
            Images
        ========================== */}
            <div className="bg-gray-50 rounded-2xl p-6 border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Images
                </h2>

                {/* Thumbnail */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail URL
                    </label>

                    <input
                        type="text"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        required
                    />

                    {thumbnail && (
                        <img
                            src={thumbnail}
                            alt="Thumbnail Preview"
                            className="mt-4 w-40 h-40 object-cover rounded-xl border"
                        />
                    )}
                </div>

                {/* Product Images */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                            Product Images
                        </label>

                        <button
                            type="button"
                            onClick={addImage}
                            className="px-4 py-2 rounded-lg bg-pink-400 text-white hover:bg-pink-500 transition cursor-pointer"
                        >
                            + Add Image
                        </button>
                    </div>

                    {images.map((image, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <input
                                type="text"
                                value={image}
                                onChange={(e) =>
                                    handleImageChange(index, e.target.value)
                                }
                                placeholder="https://..."
                                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />

                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-3 rounded-lg hover:bg-red-100 text-red-500 transition cursor-pointer"
                                    title="Delete Image"
                                >
                                    <Trash2 className="w-7 h-7" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Preview */}
                {images.some((img) => img.trim() !== '') && (
                    <div className="mt-8">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                            Preview
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {images.map((image, index) =>
                                image ? (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Preview ${index + 1}`}
                                        className="w-32 h-32 rounded-xl object-cover border"
                                    />
                                ) : null,
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ==========================
            Tags
        ========================== */}
            <div className="bg-gray-50 rounded-2xl p-6 border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Tags
                </h2>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Tags
                </label>

                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Brightening, Skincare, Daily Care"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />

                <p className="text-xs text-gray-500 mt-2">
                    Separate each tag with a comma (,).
                </p>
            </div>

            {/* ==========================
            Sizes
        ========================== */}
            <div className="bg-gray-50 rounded-2xl p-6 border">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Product Sizes
                    </h2>

                    <button
                        type="button"
                        onClick={addSize}
                        className="px-4 py-2 rounded-lg bg-pink-400 text-white hover:bg-pink-500 transition cursor-pointer"
                    >
                        + Add Size
                    </button>
                </div>

                <div className="space-y-5">
                    {sizes.map((size, index) => (
                        <div
                            key={index}
                            className="bg-white border rounded-xl p-5"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_60px] gap-4 items-end">
                                {/* Size */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Size
                                    </label>

                                    <input
                                        type="text"
                                        value={size.size}
                                        onChange={(e) =>
                                            handleSizeChange(
                                                index,
                                                'size',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="50ml"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                        required
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        value={size.price}
                                        onChange={(e) =>
                                            handleSizeChange(
                                                index,
                                                'price',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="1500000"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                        required
                                    />
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        value={size.stock}
                                        onChange={(e) =>
                                            handleSizeChange(
                                                index,
                                                'stock',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="10"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                        required
                                    />
                                </div>

                                {/* Remove */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => removeSize(index)}
                                        disabled={sizes.length === 1}
                                        title="Delete Size"
                                        className={`p-3 rounded-lg transition ${
                                            sizes.length === 1
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-red-500 hover:bg-red-100 cursor-pointer'
                                        }`}
                                    >
                                        <Trash2 className="w-7 h-7" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ==========================
            Action Buttons
        ========================== */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => router.push('/admin/catalogs')}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-pink-400 text-white font-medium hover:bg-pink-500 transition disabled:bg-pink-300 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading
                        ? mode === 'create'
                            ? 'Saving...'
                            : 'Updating...'
                        : mode === 'create'
                          ? 'Save Product'
                          : 'Update Product'}
                </button>
            </div>
        </form>
    )
}
