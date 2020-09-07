import connect from "../../lib/db"
import { ObjectID } from "bson"

const isDev = process.env.NODE_ENV !== "production"

const S = require("sanctuary")
const $ = require("sanctuary-def")

export default async (req, res) => {
  if (req.method === "POST") {
    const db = await connect()
    
    const msgData = S.parseJson(S.is($.Object))(S.prop("body")(req))  
    const variants = S.maybeToNullable(S.chain(S.unchecked.value ("variants")) (msgData))
    const variantIds = S.justs(S.unchecked.map(S.unchecked.value ("_id")) (variants))
    const variantObjectIds = S.unchecked.map(id => new ObjectID(id))(variantIds)

    const productId = S.chain(S.unchecked.value("product"))(msgData)
    let product = new ObjectID(S.maybeToNullable(productId))
    if (S.maybeToNullable(msgData).newProdLabel) {
      const result = await db.collection("products").insertOne({
        "label": S.maybeToNullable(msgData).newProdLabel,
      })
      product = result.insertedId
    }

    await db.collection("variants").updateMany(
      { _id: { $in: variantObjectIds } },
      {
        $set: { "product": product },
        $currentDate: { lastModified: true }
      }
    )

    const variantsList = await db.collection("variants").find({"product": product}).toArray()

    await db.collection("products").updateOne(
      { _id: product },
      {
        $set: { "variants": variantsList },
        $currentDate: { lastModified: true }
      }
    )

    console.log("msgData", msgData)

    return res.status(200).json({ ok: "true", success: "Variações salvas com sucesso" })
  } else {
    return res.status(400).json({ error: "Método inválido. Admins foram notificados." })
  }
}
