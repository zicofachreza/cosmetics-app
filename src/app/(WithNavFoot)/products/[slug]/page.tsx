import { Props, TProduct } from '@/types/productType'
import { Metadata } from 'next'
import DetailClient from './DetailSlug.tsx'
import ProductModel from '@/models/product'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await fetchData(slug)

    return {
        title: product.name,
        openGraph: {
            images: [product.thumbnail],
        },
    }
}

async function fetchData(slug: string): Promise<TProduct> {
    const { data } = await ProductModel.getProductBySlug(slug)

    if (!data) {
        throw new Error('Product not found')
    }

    return JSON.parse(JSON.stringify(data))
}

export default async function DetailProduct({ params }: Props) {
    const { slug } = await params
    const product = await fetchData(slug)

    return <DetailClient product={product} />
}
