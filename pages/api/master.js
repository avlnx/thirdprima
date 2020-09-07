
import connect from "../../lib/db"
import { ObjectID } from "bson"

const isDev = process.env.NODE_ENV !== "production"

const S = require("sanctuary")
const $ = require("sanctuary-def")

export default async (req, res) => {
  if (req.method === "POST") {
    const db = await connect()
    // const productsCollection = await db.collection("products")
    // const products = await grabCartsProducts(cart, productsCollection)

    // const variants = S.chain(S.prop("variants"))(products)
    // const sources = await db.collection("sources").find({}).toArray()
    

    const msgData = S.parseJson(S.is($.Object))(S.prop("body")(req))
    const productId = S.chain(S.unchecked.value ("product")) (msgData)
    const variants = S.maybeToNullable(S.chain(S.unchecked.value ("variants")) (msgData))
    const variantIds = S.justs(S.unchecked.map(S.unchecked.value ("_id")) (variants))
    const variantObjectIds = S.unchecked.map(id => new ObjectID(id))(variantIds)

    await db.collection("variants").updateMany(
      { _id: { $in: variantObjectIds } },
      {
        $set: { "product": new ObjectID(S.maybeToNullable (productId)) },
        $currentDate: { lastModified: true }
      }
    )

    console.log("msgData", msgData)

    return res.status(200).json({ success: "Dados recebidos" })
  } else {
    return res.status(400).json({ error: "Método inválido. Admins foram notificados." })
  }
}
