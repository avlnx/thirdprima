import {MongoClient} from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI // or Atlas connection string

const dbName = "seedr"

let cachedDb = null

export default async function connectToDatabase() {
  console.log('=> connect to database')

  if (cachedDb) {
    console.log('=> using cached database instance')
    return cachedDb
  }

  const client = new MongoClient(MONGODB_URI, {
    validateOptions: true,
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  await client.connect()
  cachedDb = client.db(dbName)
  return cachedDb
}
