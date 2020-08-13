import connect from "../../lib/db"
import { initialCart, CARTSTATUS } from "../../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const makePurchaseNotificationData = cart => {
  return {
    key: "newPurchase",
    to: S.props(["user", "name"])(cart),
    name: S.props(["user", "nickname"])(cart),
    subject: "Seu pedido foi recebido com sucesso.",
  }
}

const userInitialCart = owner => {
  return { ...initialCart, owner: owner}
}

const notifyPurchase = async cart => {
  const msg = makePurchaseNotificationData(cart)
  const emailResponse = await fetch(`${process.env.BASE_URL}/api/email`, {
    method: "post",
    body: JSON.stringify(msg)
  })
  return emailResponse
}

export default async (req, res) => {
  if (req.method === "POST") {
    const db = await connect()
    const carts = await db.collection("carts")

    // debugger
    const nextCart = S.parseJson(S.is($.Object))(S.prop("body")(req))

    if (S.isJust(nextCart)) {
      const cart = S.maybeToNullable(nextCart)
      // to make a "purchase" which is just a cart with a status of "pending"
      // post a nextCart here with the same cart but with a status of pending
      // then here we check for the presence of that status and if found 
      // we notify people and possibly respond differently
      const status = S.prop("status")(cart)
      if (status === CARTSTATUS.purchasePending) {
        // new purchase
        // insert this cart and also replace with an empty one on success
        const result = await carts.insertOne(cart)
        if (S.prop ("insertedCount") (result) === 1) {
          // success, insert seed cart to reset and send message
          const result2 = await carts.insertOne(userInitialCart(S.prop ("owner") (cart)))
          // notify purchase
          const emailResponse = await notifyPurchase (cart)
          if (S.prop("insertedCount")(result2) === 1 && emailResponse.status === 200) {
            return res.status(200).json({ success: "Tudo certo. Obrigada pela sua compra. Vamos preparar seu pedido e entraremos em contato em breve." })
          } else {
            // TODO: actually notify me
            return res.status(500).json({ error: "Ocorreu algum problema confirmando seu pedido. Por favor tente novamente mais tarde, nossos engenheiros já foram notificados do problema." })
          }
        }
      } 
      // regular cart
      const result = await carts.insertOne(cart)
      if (S.prop ("insertedCount") (result) === 1) {
        return res.status(200).json({ cart })
      }
    }

    return res.status(500).json({ error: "Ocorreu um erro inesperado. Por favor tente novamente mais tarde." })
  } else {
    res.status(400).json({ error: "Método inesperado."})
  }
}
