import { AddColumnLeftIcon } from "evergreen-ui"
import React from "react"

const S = require("sanctuary")
const $ = require("sanctuary-def")
const { ObjectId } = require ("bson")

////////////////////////////////////////////////////////////////////////// LISTS
export const id = S.prop("_id")

export const findByIdInList = objId => S.find(obj => S.equals(id(obj))(objId))


//////////////////////////////////////////////////////////////////////// NUMBERS
export const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const numberPropOrZero = obj => numberProp => S.fromMaybe(0)(S.get(S.is($.ValidNumber))(numberProp)(obj))


//////////////////////////////////////////////////////////////////////// OBJECTS
// stringProp :: String -> Maybe Any
export const stringProp = str => S.get(S.is($.String))(str)

// indexById :: Array -> Object
export const indexById = S.reduce(xs => obj => S.insert(obj._id)(obj)(xs))({})


///////////////////////////////////////////////////////////////////// PREDICATES
export const arrayOfObjects = S.is($.Array($.Object))


/////////////////////////////////////////////////////////////////////////// CART
export const initialCart = {
  owner: null,
  created: new Date(),
  items: {},
  total: 0,
}

export const CartContext = React.createContext(initialCart)

// getNextCart :: Object -> Maybe Object -> Object
export const getNextCart = lastCart => mutation => {
  const variantId = S.prop("variantId")(mutation)
  const delta = S.prop("delta")(mutation)
  const productId = S.prop("productId")(mutation)
  const owner = S.prop("owner")(mutation)
  const subtotal = S.prop("subtotal")(mutation)

  const oldQuantity = S.fromMaybe(0) (S.gets(S.is($.Number))(["items", productId, variantId])(lastCart))

  // adjust delta so we don't get invalid quantities (like negative quants)
  // delta needs to be between -oldQuantity and +Infinity
  // const adjustedDelta = S.max(S.negate(oldQuantity))(delta)
  const adjustedDelta = S.clamp(S.negate(oldQuantity))(Infinity)(delta)

  const newQuantity = oldQuantity + adjustedDelta

  const oldItems = S.fromMaybe({})(S.get(S.is($.Object))("items")(lastCart))

  // we "clone" the last cart and change the items. also set _id to undef so
  // it gets reset
  const newItems = newQuantity > 0 
    ? {...oldItems, [productId]: { [variantId]: newQuantity } } 
    : S.remove (variantId) (oldItems)

  const newTotal = (S.fromMaybe(0)(S.get(S.is($.ValidNumber))("total")(lastCart))) + subtotal

  const nextCart = {
      owner: owner,
      created: new Date(),
      items: newItems,
      total: newTotal
    }

  console.log("nextCart lib/prima", nextCart)
  return nextCart
}

export const makeCartMutation = productId => variantId => delta => owner => subtotal => {
  return {
    delta,
    variantId,
    productId,
    owner,
    subtotal,
  }
}

export const updateProductQuantityBy = async (owner, previousCart, productId ,  variantId, delta, subtotal) => {
  const mutation = makeCartMutation(productId)(variantId)(delta)(owner)(subtotal)

  const nextCart = getNextCart(previousCart)(mutation)

  // set off post but don't wait for the response. The state will be updated automatically but for a more snappy experience we return this nextCart and update it on the client too. The server will revalidate when the response comes. TODO: error handling
  postNextCartState(nextCart)

  // returns nextCart so we can change local state immediately 
  return nextCart
}

export const postNextCartState = async (nextCart) => {
  // setQuantity(S.max(0)(quantity + delta))
  const res = await fetch("/api/cart", {
    method: "post",
    body: JSON.stringify(nextCart)
  })
  console.log("nextCart post", res)
  return await res.json()
}

const getLatestCart = async carts => {
  const c = await carts.find({}, { sort: { "_id": -1 }, limit: 1 }).toArray()
  return S.fromMaybe({ ...initialCart })(S.head(c))
} 

const grabCartsProducts = ((latestCart, productsCollection) => {
  // const { ObjectId } = require ("mongodb")
  const productIds = S.unchecked.keys(S.prop("items")(latestCart))
  const productObjectIds = S.map(id => new ObjectId (id))(productIds)

  const query = { "_id": { $in: productObjectIds} }

  return async function() {
    const ps = await productsCollection.find(query).toArray()
    return ps
  }
})

const addMetadataToProductList = products => latestCart => {
  let totalPrice = 0
  let itemCount = 0
  const amendedProductList = S.unchecked.map(p => {
    const newVariants = S.unchecked.map(v => {
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
  })(products)

  return [amendedProductList, itemCount, totalPrice]
}


///////////////////////////////////////////////////////////////////// MONGO APIS
const getThings = async(db, things) => {
  const collection = await db.collection(things)
  const options = { limit: 20 }
  const results = await collection.find({}, options)
  const stuff = await results.toArray()
  return stuff
}
//// PRODUCTS
export const getProducts = async (db) => {
  const products = await getThings(db, 'products')
  const carts = await db.collection("carts")

  // get latest cart or seed a new one, TODO: filter by user
  const latestCart = await getLatestCart(carts)
  const [amendedProductList, itemCount, totalPrice] = addMetadataToProductList (products) (latestCart)
  return JSON.stringify(amendedProductList)
}

//// SOURCES
export const getSources = async (db) => {
  const sources = await getThings(db, 'sources')
  return JSON.stringify(sources)
}

//// CARTS
export const getCart = async (db) => {
  const carts = await db.collection("carts")
  // get latest cart or seed a new one, TODO: filter by user
  const latestCart = await getLatestCart(carts)
  return JSON.stringify({cart: latestCart})
}