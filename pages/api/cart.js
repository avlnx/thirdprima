import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
import { initialCart } from "../../lib/prima"

const handler = nextConnect();

const S = require("sanctuary")
const $ = require("sanctuary-def")

handler.use(middleware)

handler.get(async (req, res) => {
  // TODO: Filter by owner
  const carts = await req.db.collection("carts")
  const cart = await getLatestCart (carts)
  // get latest cart or seed a new one, TODO: filter by user
  const latestCart = S.fromMaybe ({...initialCart}) (S.head (cart))
  
  // const responseObject = { latestCart }
  
  // const { full } = req.query
  // if (full !== undefined) {
  // const productsCollection = await req.db.collection("products")
  // const products = await grabCartsProducts (latestCart, productsCollection)
  // const [amendedProductList, itemCount, totalPrice ] = addMetadataToProductList (products) (latestCart)
  // return res.status(200).json({ cart: { ...responseObject.cart, products: amendedProductList, itemCount, totalPrice }})
  // // }

  res.status(200).json(latestCart)
});


handler.post(async (req, res) => {
  const carts = await req.db.collection("carts")

  const nextCart = S.parseJson(S.is($.Object))(S.prop("body")(req))
  // const nextCartWithoutId = S.map (S.remove ("_id")) (nextCart)

  // TODO: validate this cart above or at least do something meaningful 
  // like returning an error and parsing the error on the client 

  if (S.isJust(nextCart)) {
    const cart = S.maybeToNullable (nextCart)
    const result = await carts.insertOne(cart)
    // const productsCollection = await req.db.collection("products")
    // const products = await grabCartsProducts(cart, productsCollection)
    // const [amendedProductList, itemCount, totalPrice] = addMetadataToProductList (products)(cart)/
    console.log("POST /api/cart", cart)
    console.log("POST result", result)
    return res.status(200).json({ cart })
  }  

  return res.status(400).json({ error: "Estrutura do carrinho inesperada. Erro de programador. Por favor tente novamente mais tarde." });
});

export default handler;
