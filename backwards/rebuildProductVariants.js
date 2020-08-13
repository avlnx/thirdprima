import nextConnect from "next-connect"
import middleware from "../../middleware/database"

const handler = nextConnect()

const S = require("sanctuary")
const $ = require("sanctuary-def")

handler.use(middleware)

const renameProperty = prop => newProp => obj => {
  // inserts old prop's value as the newProp
  const objWithNewProp = S.unchecked.insert(newProp)(S.prop(prop)(obj))(obj)
  return S.unchecked.remove(prop)(objWithNewProp)
}

handler.get(async (req, res) => {
  const variantsCollection = await req.db.collection("variants")
  const productsCollection = await req.db.collection("products")

  const productsCursor = await productsCollection.find({})
  let productsCount = await productsCursor.count()
  let counter = 0

  while (await productsCursor.hasNext()) {
    const product = await productsCursor.next()

    const variants = await variantsCollection.find({ "product": product._id }).toArray()

    const updateObj = {
      updateOne: {
        "filter": { "_id": product._id },
        "update": {
          $set: { "variants": variants },
          $currentDate: { lastModified: true }
        }
      }
    }
    // updateObjs.push(updateObj)
    await productsCollection.updateOne(updateObj.updateOne.filter, updateObj.updateOne.update)
    counter++
    console.log(`Processed ${product.label} ${counter} of ${productsCount}`)
  }

  res.status(200).json({ "done": "yes" })
})

export default handler
