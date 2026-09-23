const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

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

        const users = require('./data/admin.data.json')
        const userCollection = db.collection('users')

        // hapus dulu collection biar tidak duplicate
        await userCollection.drop().catch(() => {})

        const now = new Date()

        // 🔥 HASH PASSWORD DI SINI
        const userWithTimestamps = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10)

                return {
                    ...user,
                    password: hashedPassword,
                    createdAt: now,
                    updatedAt: now,
                }
            }),
        )

        await userCollection.insertMany(userWithTimestamps)

        console.log('✅ Admin seeded successfully with hashed password')
    } catch (error) {
        console.error('❌ Seeding error:', error)
    } finally {
        await client.close()
    }
}

seed()
