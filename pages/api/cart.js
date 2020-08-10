import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
import { ObjectId } from "mongodb"
import { getNextCart } from "../../lib/prima"

const handler = nextConnect();

const S = require("sanctuary")
const $ = require("sanctuary-def")

const initialCart = {
  owner: null,
  created: new Date(),
  items: {}
}

const getLatestCart = async carts => await carts.find({}, { sort: { "_id": -1 }, limit: 1 }).toArray()

const grabCartsProducts = async (latestCart, productsCollection) => {
  const productIds = S.unchecked.keys(S.prop("items")(latestCart))
  const productObjectIds = S.map(ObjectId)(productIds)

  const query = { "_id": { $in: productObjectIds } }
  const ps = await productsCollection.find(query).toArray()
  return ps
}

const addMetadataToProductList = products => latestCart => {
  debugger
  let totalPrice = 0
  let itemCount = 0
  const amendedProductList = S.unchecked.map(p => {
    debugger
    const newVariants = S.unchecked.map(v => {
      debugger
      const pId = S.prop("_id")(p)
      const vId = S.prop("_id")(v)
      const mbVariantQuantity = S.unchecked.gets(S.is($.FiniteNumber))([pId, vId])(S.prop("items")(latestCart))
      const jQuantity = S.fromMaybe(0)(mbVariantQuantity)
      const jPrice = S.fromMaybe(0)(S.get(S.is($.FiniteNumber))("price")(v))
      const jPackSize = S.fromMaybe(0)(S.get(S.is($.FiniteNumber))("pack_size")(v))
      totalPrice += (jQuantity * jPrice * jPackSize)
      itemCount += jQuantity
      return { ...v, quantity: jQuantity }
    })(S.prop("variants")(p))
    return { ...p, variants: newVariants }
  }) (products)

  return [amendedProductList, itemCount, totalPrice]
}

handler.use(middleware)

handler.get(async (req, res) => {
  // TODO: Filter by owner
  const carts = await req.db.collection("carts")
  const cart = await getLatestCart (carts)
  // get latest cart or seed a new one, TODO: filter by user
  const latestCart = S.fromMaybe ({...initialCart}) (S.head (cart))
  
  // const productIds = S.unchecked.keys (S.prop ("items") (latestCart))
  // const productObjectIds = S.map (ObjectId) (productIds)
  
  const responseObject = { cart: latestCart }
  
  const { full } = req.query
  if (full !== undefined) {
    const productsCollection = await req.db.collection("products")
    const products = await grabCartsProducts (latestCart, productsCollection)
    const [ productsWithQuantities, itemCount, totalPrice ] = addMetadataToProductList (products) (latestCart)
    return res.status(200).json({cart: {...responseObject.cart, products: productsWithQuantities, itemCount, totalPrice }})
  }

  res.status(200).json(responseObject)
});


handler.post(async (req, res) => {
  
  const carts = await req.db.collection('carts')

  const nextCart = S.parseJson(S.is($.Object))(S.prop("body")(req))

  // TODO: validate this cart above or at least do something meaningful 
  // like returning an error and parsing the error on the client 


  S.isJust(nextCart) ? await carts.insertOne(S.maybeToNullable(nextCart)) : null

  res.status(200).json({ cart: S.maybeToNullable(nextCart) });
});

export default handler;
