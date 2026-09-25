import { connectToDB } from '@/lib/db'
import { ProductPayload, TProduct } from '@/types/productType'
import { ObjectId } from 'mongodb'

export default class ProductModel {
    static async productCollection() {
        const db = await connectToDB()
        return db.collection<TProduct>('products')
    }

    static async getAllProducts(
        page: number,
        limit: number,
        category?: string,
        sort?: string,
    ): Promise<{ data: TProduct[] }> {
        const collection = await this.productCollection()

        const query: any = {}

        if (category && category !== 'all') {
            query.category = category
        }

        let sortOption: any = { createdAt: -1 }

        if (sort === 'price_asc') {
            sortOption = { lowestPrice: 1 }
        }

        if (sort === 'price_desc') {
            sortOption = { lowestPrice: -1 }
        }

        const products = await collection
            .find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray()

        return { data: products }
    }

    static async getAllProductsAdmin(
        page: number,
        limit: number,
        category?: string,
        sort?: string,
    ): Promise<{
        data: TProduct[]
        total: number
        totalPages: number
    }> {
        const collection = await this.productCollection()

        const query: any = {}

        if (category && category !== 'all') {
            query.category = category
        }

        let sortOption: any = { createdAt: -1 }

        switch (sort) {
            case 'price_asc':
                sortOption = { lowestPrice: 1 }
                break

            case 'price_desc':
                sortOption = { lowestPrice: -1 }
                break

            case 'name_asc':
                sortOption = { name: 1 }
                break

            case 'name_desc':
                sortOption = { name: -1 }
                break
        }

        const total = await collection.countDocuments(query)

        const products = await collection
            .find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray()

        return {
            data: products,
            total,
            totalPages: Math.ceil(total / limit),
        }
    }

    static async getSliceProducts() {
        const collection = await this.productCollection()
        return collection.find().toArray()
    }

    static async getProductBySlug(slug: string) {
        const collection = await this.productCollection()
        const product = await collection.findOne({ slug })

        return { data: product }
    }

    static async searchProducts(query: string) {
        const collection = await this.productCollection()
        const products = await collection
            .find({ name: { $regex: query, $options: 'i' } })
            .toArray()

        return { data: products }
    }

    static async findById(productId: string | ObjectId) {
        if (typeof productId === 'string') {
            productId = new ObjectId(productId)
        }
        const collection = await this.productCollection()
        return collection.findOne({ _id: productId })
    }

    static async findSize(product: TProduct, size: string) {
        if (!product || !product.sizes) return null
        return product.sizes.find((s) => s.size === size) || null
    }

    static async decreaseStock(productId: ObjectId, size: string, qty: number) {
        const collection = await this.productCollection()

        await collection.updateOne(
            { _id: productId, 'sizes.size': size },
            { $inc: { 'sizes.$.stock': -qty } },
        )

        console.log(`📦 Stock -${qty} (${size}) for ${productId} product`)
    }

    static async increaseStock(productId: ObjectId, size: string, qty: number) {
        const collection = await this.productCollection()

        await collection.updateOne(
            { _id: productId, 'sizes.size': size },
            { $inc: { 'sizes.$.stock': qty } },
        )

        console.log(
            `♻️ Stock +${qty} (${size}) returned for ${productId} product`,
        )
    }

    static async createProduct(payload: ProductPayload) {
        const collection = await this.productCollection()

        const existing = await collection.findOne({
            slug: payload.slug,
        })

        if (existing) {
            throw new Error('Slug already exists')
        }

        const result = await collection.insertOne({
            name: payload.name,
            slug: payload.slug,
            description: payload.description,
            excerpt: payload.excerpt,
            category: payload.category,
            thumbnail: payload.thumbnail,
            images: payload.images,
            tags: payload.tags,
            sizes: payload.sizes,
            lowestPrice: Math.min(...payload.sizes.map((item) => item.price)),
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any)

        return result
    }

    static async updateProduct(
        productId: string | ObjectId,
        payload: ProductPayload,
    ) {
        if (typeof productId === 'string') {
            productId = new ObjectId(productId)
        }

        const collection = await this.productCollection()

        const existing = await collection.findOne({
            _id: { $ne: productId },
            slug: payload.slug,
        })

        if (existing) {
            throw new Error('Slug already exists')
        }

        const result = await collection.updateOne(
            {
                _id: productId,
            },
            {
                $set: {
                    name: payload.name,
                    slug: payload.slug,
                    description: payload.description,
                    excerpt: payload.excerpt,
                    category: payload.category,
                    thumbnail: payload.thumbnail,
                    images: payload.images,
                    tags: payload.tags,
                    sizes: payload.sizes,
                    lowestPrice: Math.min(
                        ...payload.sizes.map((item) => item.price),
                    ),
                    updatedAt: new Date(),
                },
            },
        )

        return result
    }

    static async deleteProduct(productId: string | ObjectId) {
        if (typeof productId === 'string') {
            productId = new ObjectId(productId)
        }

        const collection = await this.productCollection()

        const result = await collection.deleteOne({
            _id: productId,
        })

        return result
    }
}
