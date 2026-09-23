import { ObjectId } from 'mongodb'

export type Props = {
    params: Promise<{
        slug: string
    }>
}

export interface TSize {
    size: string
    price: number
    stock: number
}

export interface TProduct {
    _id: ObjectId
    name: string
    slug: string
    description: string
    excerpt: string
    category:string
    lowestPrice: number
    tags: string[]
    thumbnail: string
    images: string[]
    sizes: TSize[]
    createdAt: Date
    updatedAt: Date
}

export interface ArrayOfProduct {
    data: TProduct[]
}

export interface CardProps {
    _id: ObjectId
    name: string
    excerpt: string
    thumbnail: string
    lowestPrice: number
    slug: string
}

export interface ProductPayload {
    name: string
    slug: string
    description: string
    excerpt: string
    category: string
    thumbnail: string
    images: string[]
    tags: string[]
    sizes: TSize[]
}

export interface ProductFormProps {
    mode: 'create' | 'edit'
    initialData?: {
        _id: string
        name: string
        slug: string
        category: string
        excerpt: string
        description: string
        thumbnail: string
        images: string[]
        tags: string[]
        sizes: TSize[]
    }
}
