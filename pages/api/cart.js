// import nextConnect from 'next-connect';
import connect from "../../lib/db"
import { initialCart } from "../../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

export default async (req, res) => {
  if (req.method === 'POST') {
    const db = await connect()
    const carts = await db.collection("carts")

    const nextCart = S.parseJson(S.is($.Object))(S.prop("body")(req))

    // TODO: validate this cart above or at least do something meaningful 
    // like returning an error and parsing the error on the client 

    if (S.isJust(nextCart)) {
      const cart = S.maybeToNullable(nextCart)
      const result = await carts.insertOne(cart)
      return res.status(200).json({ cart })
    }

    return res.status(400).json({ error: "Estrutura do carrinho inesperada. Por favor tente novamente mais tarde." })
  } else {
    // TODO: Filter by owner
    const db = await connect()
    const carts = await db.collection("carts")
    const cart = await getLatestCart(carts)

    // get latest cart or seed a new one, TODO: filter by user
    const latestCart = S.fromMaybe({ ...initialCart })(S.head(cart))
    res.status(200).json(latestCart)
  }
}


// handler.get( (req, res) => {
//   // TODO: Filter by owner
//   const db = await connect()
//   const carts = await db.collection("carts")
//   const cart = await getLatestCart (carts)

//   // get latest cart or seed a new one, TODO: filter by user
//   const latestCart = S.fromMaybe ({...initialCart}) (S.head (cart))
//   res.status(200).json(latestCart)
// })


// handler.post(async (req, res) => {
//   const db = await connect()
//   const carts = await db.collection("carts")

//   const nextCart = S.parseJson(S.is($.Object))(S.prop("body")(req))

//   // TODO: validate this cart above or at least do something meaningful 
//   // like returning an error and parsing the error on the client 

//   if (S.isJust(nextCart)) {
//     const cart = S.maybeToNullable (nextCart)
//     const result = await carts.insertOne(cart)
//     return res.status(200).json({ cart })
//   }  

//   return res.status(400).json({ error: "Estrutura do carrinho inesperada. Por favor tente novamente mais tarde." })
// })
