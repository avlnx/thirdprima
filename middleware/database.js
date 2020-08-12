// import { MongoClient } from "mongodb"

// const MONGODB_URI = process.env.MONGODB_URI

// const dbName = "seedr"

// let cachedDb = null

// export default async function connectToDatabase() {
//   if (cachedDb) {
//     console.log('=> using cached database instance...')
//     return cachedDb
//   }

//   console.log('=> creating new mongo connection...')

  // const client = new MongoClient(MONGODB_URI, {
  //   validateOptions: true,
  //   connectTimeoutMS: 10000,
  //   useUnifiedTopology: true,
  //   useNewUrlParser: true,
  // })
//   await client.connect()
//   cachedDb = client.db(dbName)
//   return cachedDb
// }
async function Connection() {
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
    return client
  }
  Connection._instance = client
}
// var f = new Connection(); //calls Connection as a constructor
// -or -
// var f = Connection(); //also calls Connection as a constructor