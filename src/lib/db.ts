import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGO_URI as string
const database = process.env.MONGO_DB_NAME

if (!uri || !database) {
    throw new Error('Missing MONGO_URI or MONGO_DB_NAME in environment')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
    // biar gak duplicate instance pas hot reload di dev
    var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        })
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    // production (serverless, tanpa global)
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    })
    clientPromise = client.connect()
}

export async function connectToDB() {
    try {
        const client = await clientPromise
        return client.db(database)
    } catch (err: unknown) {
        const error = err as Error
        console.error('[MongoDB Connection Error]', error)
        throw new Error('Failed to connect to the database')
    }
}
