import nextConnect from 'next-connect'
import middleware from '../../middleware/database'
import { ObjectId } from "mongodb"

const handler = nextConnect()

const S = require("sanctuary")
const $ = require("sanctuary-def")

handler.use(middleware);

const renameProperty = prop => newProp => obj => {
  // inserts old prop's value as the newProp
  const objWithNewProp = S.unchecked.insert(newProp)(S.prop(prop)(obj))(obj)
  return S.unchecked.remove(prop)(objWithNewProp)
}

handler.get(async (req, res) => {
  const options = {limit: 100}

  const variantsCollection = await req.db.collection("variants")
  const productsCollection = await req.db.collection("products")

  const productsCursor = await productsCollection.find({})

  const product = await productsCursor.next()
  console.log("product before update", product)
  const queryByProductId = id => ({ "product": id })
  const variants = await variantsCollection.find(queryByProductId (product._id)).toArray()
  console.log("variants", variants)

  const updateObj = { updateOne: {
    "filter": { "_id": product._id },
    "update": { 
      $set : { "variants": variants },
      $currentDate: { lastModified: true }
    }
  }}

  const result = productsCollection.updateOne(updateObj.updateOne.filter, updateObj.updateOne.update)

  console.log("updateObj", updateObj)

  console.log("result", result)

  res.status(200).json({ product, variants, result });
});

export default handler;














  // const filterUpdateObjects = S.map(p => {
  //   const productId = ObjectId(p._id)
  //   const q = {"product": productId}
  //   const pVariants = S.filter (v => {
  //     const vProductId =  S.maybe ({}) (ObjectId) (S.get(_ => true)("product")(v))
  //     return productId.equals(vProductId)
  //   }) (variants)
  //   const filter = { _id: productId}
  //   const update = {
  //     $set: {
  //       variants: pVariants
  //     }
  //   }
  //   // p.variants = variants
  //   return { filter, update }
  // }) (products)

  // foreach product in products:
  // get productId and find all variants with said productId as its product
  // add these variants as the products variants and save with $set (return "filter, update" object)
  // bulkWrite the updates generated above
  // done