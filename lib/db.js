import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI

const dbName = "seedr"

export default async function Connection() {
  if (Connection._instance) {
    return Connection._instance
  }
  //if the function wasn't called as a constructor,
  //call it as a constructor and return the result
  if (!(this instanceof Connection)) {
    // return new Connection();
    const client = new MongoClient(MONGODB_URI, {
      validateOptions: true,
      connectTimeoutMS: 10000,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    await client.connect()
    return client.db(dbName)
  }
  Connection._instance = client
}
