import { connectToDB } from '@/lib/db'
import { OrderDetail } from '@/types/orderType'
import { ObjectId, UpdateFilter, Collection } from 'mongodb'

export default class OrderModel {
    static async orderCollection(): Promise<Collection<OrderDetail>> {
        const db = await connectToDB()
        return db.collection<OrderDetail>('orders')
    }

    static async findOrdersWithFilter({
        userId,
        page = 1,
        pageSize = 10,
    }: {
        request: Request
        userId: string | ObjectId
        page?: number
        pageSize?: number
    }) {
        if (typeof userId === 'string') userId = new ObjectId(userId)

        const collection = await this.orderCollection()

        const total = await collection.countDocuments({ userId })

        let data = await collection
            .find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const now = new Date()
        data = await Promise.all(
            data.map(async (order) => {
                if (
                    order.status === 'pending' &&
                    order.expiryTime &&
                    now > order.expiryTime
                ) {
                    if (order.midtransOrderId) {
                        await OrderModel.updateStatusByMidtrans(
                            order.midtransOrderId,
                            'failed',
                        )
                    }
                    return { ...order, status: 'failed' }
                }
                return order
            }),
        )

        const result = {
            data,
            total,
            page,
            totalPages: Math.ceil(total / pageSize),
        }

        return result
    }

    static async findAllOrdersWithFilter({
        page = 1,
        pageSize = 10,
        search = '',
        status = '',
    }: {
        page?: number
        pageSize?: number
        search?: string
        status?: string
    }) {
        const db = await connectToDB()
        const collection = db.collection('orders')

        const pipeline: any[] = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
        ]

        const match: any = {}

        if (search) {
            match.$or = [
                {
                    'user.name': {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    'user.email': {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    midtransOrderId: {
                        $regex: search,
                        $options: 'i',
                    },
                },
            ]
        }

        if (status) {
            match.status = status
        }

        if (Object.keys(match).length > 0) {
            pipeline.push({
                $match: match,
            })
        }

        pipeline.push({
            $sort: {
                createdAt: -1,
            },
        })

        const countPipeline = [...pipeline]

        countPipeline.push({
            $count: 'total',
        })

        const totalResult = await collection.aggregate(countPipeline).toArray()

        const total = totalResult.length > 0 ? totalResult[0].total : 0

        pipeline.push(
            {
                $skip: (page - 1) * pageSize,
            },
            {
                $limit: pageSize,
            },
            {
                $project: {
                    _id: 1,
                    midtransOrderId: 1,
                    total: 1,
                    status: 1,
                    createdAt: 1,
                    expiryTime: 1,
                    userId: 1,
                    shipping: 1,
                    items: 1,
                    snapToken: 1,
                    userName: '$user.name',
                    userEmail: '$user.email',
                },
            },
        )

        let data = await collection.aggregate(pipeline).toArray()

        const now = new Date()

        data = await Promise.all(
            data.map(async (order: any) => {
                if (
                    order.status === 'pending' &&
                    order.expiryTime &&
                    now > new Date(order.expiryTime)
                ) {
                    if (order.midtransOrderId) {
                        await this.updateStatusByMidtrans(
                            order.midtransOrderId,
                            'failed',
                        )
                    }

                    return {
                        ...order,
                        status: 'failed',
                    }
                }

                return order
            }),
        )

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / pageSize),
        }
    }

    // 🧾 Insert new order
    static async insertOrder(data: {
        _id: ObjectId
        userId: ObjectId
        items: {
            productId: ObjectId
            name: string
            price: number
            size: string
            quantity: number
            subtotal: number
        }[]
        shipping: {
            firstName: string
            lastName: string
            email: string
            address: string
            phone: string
        }
        total: number
        status: string
        createdAt: Date
        updatedAt: Date
        snapToken?: string
        snapRedirectUrl?: string
        midtransOrderId?: string
        expiryTime?: Date
    }) {
        const collection = await this.orderCollection()
        const result = collection.insertOne(data)
        return result
    }

    static async findByUserId(userId: string | ObjectId) {
        if (typeof userId === 'string') userId = new ObjectId(userId)
        const collection = await this.orderCollection()
        return collection.find({ userId }).sort({ createdAt: -1 }).toArray()
    }

    static async findById(
        orderId: string | ObjectId,
    ): Promise<OrderDetail | null> {
        if (typeof orderId === 'string') orderId = new ObjectId(orderId)

        const collection = await this.orderCollection()

        const orderDoc = await collection.findOne<OrderDetail>({ _id: orderId })
        if (!orderDoc) return null

        if (typeof orderDoc.createdAt === 'string') {
            orderDoc.createdAt = new Date(orderDoc.createdAt)
        }

        return orderDoc
    }

    static async findByMidtransOrderId(orderId: string) {
        const collection = await this.orderCollection()
        return collection.findOne({ midtransOrderId: orderId })
    }

    static async updateStatus(orderId: string | ObjectId, status: string) {
        if (typeof orderId === 'string') orderId = new ObjectId(orderId)
        const collection = await this.orderCollection()
        const result = collection.updateOne(
            { _id: orderId },
            { $set: { status } },
        )

        return result
    }

    static async updateById(
        orderId: string | ObjectId,
        data: UpdateFilter<OrderDetail>,
    ) {
        if (typeof orderId === 'string') orderId = new ObjectId(orderId)
        const collection = await this.orderCollection()
        const result = collection.updateOne({ _id: orderId }, { $set: data })

        return result
    }

    static async attachMidtransData(
        orderId: ObjectId | string,
        data: {
            midtransOrderId: string
            snapToken: string
            snapRedirectUrl: string
            expiryTime: Date
        },
    ) {
        if (typeof orderId === 'string') orderId = new ObjectId(orderId)
        const collection = await this.orderCollection()
        const result = collection.updateOne({ _id: orderId }, { $set: data })

        return result
    }

    static async updateStatusByMidtrans(orderId: string, newStatus: string) {
        const collection = await this.orderCollection()
        const result = collection.updateOne(
            { midtransOrderId: orderId },
            { $set: { status: newStatus } },
            { upsert: false },
        )

        return result
    }

    static async deleteById(orderId: string | ObjectId) {
        if (typeof orderId === 'string') orderId = new ObjectId(orderId)
        const collection = await this.orderCollection()
        const result = collection.deleteOne({ _id: orderId })

        return result
    }

    static async cancelOrder(orderId: string | ObjectId) {
        if (typeof orderId === 'string') orderId = new ObjectId(orderId)

        const collection = await this.orderCollection()

        return collection.updateOne(
            { _id: orderId },
            { $set: { status: 'cancelled' } },
        )
    }

    static async getReportData({
        startDate,
        endDate,
    }: {
        startDate?: string | null
        endDate?: string | null
    }) {
        const collection = await this.orderCollection()

        const match: any = {
            status: 'paid',
        }

        if (startDate && endDate) {
            match.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            }
        }

        const orders = await collection.find(match).toArray()

        const totalOrders = orders.length
        const revenue = orders.reduce((acc, o) => acc + o.total, 0)

        // 📊 group by date
        const salesMap: Record<string, number> = {}

        orders.forEach((o) => {
            const date = new Date(o.createdAt).toISOString().split('T')[0]
            salesMap[date] = (salesMap[date] || 0) + o.total
        })

        const salesData = Object.entries(salesMap).map(([date, total]) => ({
            date,
            total,
        }))

        // 🏆 top products
        const productMap: Record<string, { sold: number; revenue: number }> = {}

        orders.forEach((o) => {
            o.items.forEach((item) => {
                if (!productMap[item.name]) {
                    productMap[item.name] = { sold: 0, revenue: 0 }
                }

                productMap[item.name].sold += item.quantity
                productMap[item.name].revenue += item.subtotal
            })
        })

        const topProducts = Object.entries(productMap)
            .map(([name, val]) => ({ name, ...val }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5)

        return {
            totalOrders,
            revenue,
            salesData,
            topProducts,
        }
    }
}
