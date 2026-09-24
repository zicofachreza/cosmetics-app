'use client'

import ProductCard from '@/app/components/ProductCard'
import { TProduct } from '@/types/productType'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductPage() {
    const [products, setProducts] = useState<TProduct[]>([])
    const [search, setSearch] = useState<string>('')
    const [searchProduct, setSearchProduct] = useState<TProduct[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('')

    const [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState<boolean>(true)

    const [category, setCategory] = useState<string>('all')
    const [sort, setSort] = useState<string>('')

    const [openCategory, setOpenCategory] = useState(false)
    const [openSort, setOpenSort] = useState(false)

    const categoryRef = useRef<HTMLDivElement>(null)
    const sortRef = useRef<HTMLDivElement>(null)

    const limit = 8

    async function searchData(query: string) {
        try {
            const response = await fetch(
                `/api/products/search?search=${query}`,
                { cache: 'no-store' },
            )

            const result = await response.json()

            if (!result?.data || result.data.length === 0) {
                setSearchProduct([])
                setErrorMessage('Product not found')
                return
            }

            setSearchProduct(result.data)
            setErrorMessage('')
        } catch (error) {
            console.error(error)
            setSearchProduct([])
            setErrorMessage('Something went wrong')
        }
    }

    async function fetchProducts(page: number) {
        try {
            const params = new URLSearchParams()

            params.append('page', page.toString())
            params.append('limit', limit.toString())

            if (category !== 'all') params.append('category', category)
            if (sort) params.append('sort', sort)

            const response = await fetch(
                `/api/products?${params.toString()}`,
                { cache: 'no-store' },
            )

            const result = await response.json()

            const data = result?.data || []

            if (data.length === 0) {
                setErrorMessage('No products yet')
                setHasMore(false)
                return []
            }

            setErrorMessage('')
            return data
        } catch (error) {
            console.error(error)
            setErrorMessage('Something went wrong')
            return []
        }
    }

    async function fetchMoreData() {
        const nextPage = page + 1
        const newProducts = await fetchProducts(nextPage)

        if (newProducts.length === 0) {
            setHasMore(false)
            return
        }

        setProducts((prev) => [...prev, ...newProducts])
        setPage(nextPage)
    }

    async function loadInitialProducts() {
        setProducts([])
        setPage(1)
        setHasMore(true)
        setErrorMessage('')

        const initialProducts = await fetchProducts(1)

        if (initialProducts.length === 0) {
            setProducts([])
            setErrorMessage('No products yet')
            return
        }

        setProducts(initialProducts)
        setHasMore(initialProducts.length >= limit)
    }

    useEffect(() => {
        loadInitialProducts()
    }, [category, sort])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (search.trim()) {
                searchData(search.trim())
            } else {
                setSearchProduct(products)

                if (products.length === 0) {
                    setErrorMessage('No products yet')
                } else {
                    setErrorMessage('')
                }
            }
        }, 500)

        return () => clearTimeout(handler)
    }, [search, products])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                categoryRef.current &&
                !categoryRef.current.contains(e.target as Node)
            ) {
                setOpenCategory(false)
            }

            if (
                sortRef.current &&
                !sortRef.current.contains(e.target as Node)
            ) {
                setOpenSort(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const renderProducts = search ? searchProduct : products
    const showError = errorMessage && renderProducts.length === 0

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Products
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Discover our full collection of beauty essentials
                        </p>
                    </div>
                </div>

                {/* FILTER BAR */}
                <div className="bg-pink-100 p-4 rounded-xl shadow-sm mb-10 flex items-center justify-between">
                    {/* SEARCH */}
                    <div className="flex items-center bg-white text-sm w-70 px-4 py-2 rounded-full gap-2">
                        <Image
                            src="/search.png"
                            alt="Search"
                            width={16}
                            height={16}
                        />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none flex-1"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* CATEGORY */}
                        <div ref={categoryRef} className="relative">
                            <button
                                onClick={() => {
                                    setOpenCategory(!openCategory)
                                    setOpenSort(false)
                                }}
                                className="flex items-center justify-between w-44 bg-white px-4 py-2 rounded-full text-sm cursor-pointer"
                            >
                                {category === 'all' ? 'Categories' : category}

                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${
                                        openCategory ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openCategory && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 cursor-pointer"
                                    >
                                        {[
                                            'all',
                                            'Makeup',
                                            'Skincare',
                                            'Haircare',
                                            'Bodycare',
                                        ].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setCategory(cat)
                                                    setOpenCategory(false)
                                                }}
                                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${category === cat ? 'bg-gray-100' : ''}`}
                                            >
                                                {cat === 'all' ? 'All' : cat}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* SORT */}
                        <div ref={sortRef} className="relative">
                            <button
                                onClick={() => {
                                    setOpenSort(!openSort)
                                    setOpenCategory(false)
                                }}
                                className="flex items-center justify-between w-44 bg-white px-4 py-2 rounded-full text-sm cursor-pointer"
                            >
                                {sort === 'price_asc'
                                    ? 'Price: Low to High'
                                    : sort === 'price_desc'
                                      ? 'Price: High to Low'
                                      : 'Sort By'}

                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${
                                        openSort ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openSort && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                    >
                                        <button
                                            onClick={() => {
                                                setSort('')
                                                setOpenSort(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                sort === '' ? 'bg-gray-100' : ''
                                            }`}
                                        >
                                            Default
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSort('price_asc')
                                                setOpenSort(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                sort === 'price_asc'
                                                    ? 'bg-gray-100'
                                                    : ''
                                            }`}
                                        >
                                            Price: Low to High
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSort('price_desc')
                                                setOpenSort(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                sort === 'price_desc'
                                                    ? 'bg-gray-100'
                                                    : ''
                                            }`}
                                        >
                                            Price: High to Low
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* PRODUCTS */}
                <InfiniteScroll
                    dataLength={renderProducts.length}
                    next={fetchMoreData}
                    hasMore={!search && hasMore}
                    loader={
                        <h4 className="flex justify-center text-lg my-9 font-semibold">
                            Loading...
                        </h4>
                    }
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {showError ? (
                            <p className="col-span-4 text-center text-lg my-9 font-semibold">
                                {errorMessage}
                            </p>
                        ) : (
                            renderProducts.map((product, idx) => (
                                <ProductCard
                                    key={idx}
                                    product={product}
                                />
                            ))
                        )}
                    </div>
                </InfiniteScroll>
            </div>
        </section>
    )
}
