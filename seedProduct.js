const { MongoClient } = require('mongodb')

const client = new MongoClient(
    'mongodb+srv://zicofachreza_db_user:R2SlBktTcNY6fs1b@cluster0.u9thp9k.mongodb.net/?appName=Cluster0',
)

const createMongoDBConnection = async () => {
    try {
        await client.connect()
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        throw error
    }
}

const seed = async () => {
    try {
        await createMongoDBConnection()
        const db = client.db('cosmetics-db')
        const products = require('./data/product.data.json')
        const productCollection = db.collection('products')

        // hapus dulu collection biar tidak duplicate
        await productCollection.drop().catch(() => {})

        const now = new Date()
        const productsWithTimestamps = products.map((product) => ({
            ...product,
            createdAt: now,
            updatedAt: now,
        }))

        await productCollection.insertMany(productsWithTimestamps)
        console.log('Products seeded successfully')
    } finally {
        await client.close()
    }
}

seed()
