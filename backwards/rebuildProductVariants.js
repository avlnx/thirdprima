import connect from "../../lib/db"

const S = require("sanctuary")
const $ = require("sanctuary-def")

export default async (req, res) => {
  const session = await getSession(req)

  if (!session || session.email != "tdasilva@tuta.io") {
    return res.status(401).body("Não autorizado.")
  }

  const db = await connect()
  
  const variantsCollection = await db.collection("variants")
  const productsCollection = await db.collection("products")

  const productsCursor = await productsCollection.find({})
  let productsCount = await productsCursor.count()
  let counter = 0

  while (await productsCursor.hasNext()) {
    const product = await productsCursor.next()

    const variants = await variantsCollection.find({ "product": product._id, flagged: false, deleted: { $ne: true} }).toArray()

    const updateObj = {
      updateOne: {
        "filter": { "_id": product._id },
        "update": {
          $set: { "variants": variants },
          $currentDate: { lastModified: true }
        }
      }
    }

    await productsCollection.updateOne(updateObj.updateOne.filter, updateObj.updateOne.update)
    counter++
    console.log(`Processed ${product.label} ${counter} of ${productsCount}`)
  }

  res.status(200).json({ "done": "yes" })
  
})
