import { connectToDB } from '@/lib/db'
import { ObjectId } from 'mongodb'

export default class CartModel {
    static async cartCollection() {
        const db = await connectToDB()
        return db.collection('carts')
    }

    static async findAllByUserId(userId: string | ObjectId) {
        if (typeof userId === 'string') {
            userId = new ObjectId(userId)
        }

        const collection = await this.cartCollection()

        return collection
            .aggregate([
                { $match: { userId } },

                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'product',
                    },
                },

                { $unwind: '$product' },

                // ambil size yang dipilih
                {
                    $addFields: {
                        selectedSize: {
                            $first: {
                                $filter: {
                                    input: '$product.sizes',
                                    as: 's',
                                    cond: { $eq: ['$$s.size', '$size'] },
                                },
                            },
                        },
                    },
                },

                {
                    $project: {
                        _id: 1,
                        productId: 1,
                        size: 1,
                        quantity: 1,
                        createdAt: 1,

                        'product.name': 1,
                        'product.thumbnail': 1,
                        'product.slug': 1,

                        price: '$selectedSize.price',
                        stock: '$selectedSize.stock',
                    },
                },
            ])
            .toArray()
    }

    static async findByUserProductSize(
        userId: string | ObjectId,
        productId: string | ObjectId,
        size: string,
    ) {
        if (typeof userId === 'string') userId = new ObjectId(userId)
        if (typeof productId === 'string') productId = new ObjectId(productId)

        const collection = await this.cartCollection()
        return collection.findOne({ userId, productId, size })
    }

    static async insertItem(data: {
        userId: ObjectId
        productId: ObjectId
        size: string
        quantity: number
    }) {
        const collection = await this.cartCollection()
        return collection.insertOne({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    static async updateQuantity(_id: ObjectId, quantity: number) {
        const collection = await this.cartCollection()
        return collection.updateOne({ _id }, { $set: { quantity } })
    }

    static async updateQuantityByProduct(
        userId: string | ObjectId,
        productId: string | ObjectId,
        size: string,
        quantity: number,
    ) {
        if (typeof userId === 'string') userId = new ObjectId(userId)
        if (typeof productId === 'string') productId = new ObjectId(productId)

        const collection = await this.cartCollection()
        return collection.updateOne(
            { userId, productId, size },
            { $set: { quantity } },
        )
    }

    static async deleteItem(
        userId: string | ObjectId,
        productId: string | ObjectId,
        size: string,
    ) {
        if (typeof userId === 'string') userId = new ObjectId(userId)
        if (typeof productId === 'string') productId = new ObjectId(productId)

        const collection = await this.cartCollection()
        return collection.deleteOne({ userId, productId, size })
    }

    static async clearByUserId(userId: string | ObjectId) {
        if (typeof userId === 'string') {
            userId = new ObjectId(userId)
        }

        const collection = await this.cartCollection()
        return collection.deleteMany({ userId })
    }
}
