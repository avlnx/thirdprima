import React from "react"
import { last } from "sanctuary"

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

export const parseJsonFromListOfObjects = S.parseJson(S.is($.Array($.Object)))
export const parseJsonFromObject = S.parseJson(S.is($.Object))


/////////////////////////////////////////////////////////////////////////// CART
export const CARTSTATUS = {
  auto: "auto",
  purchasePending: "pending",
  purchasePaid: "paid",
  purchaseCanceled: "canceled"
}
export const initialCart = {
  owner: null,
  created: new Date(),
  items: {},
  total: 0,
  status: CARTSTATUS.auto,
}

export const CartContext = React.createContext(initialCart)

export const getCartQuantity = cart => productIdValue => variantIdValue => S.fromMaybe(0)(S.gets(S.is($.NonZeroValidNumber))([productIdValue, variantIdValue])(S.prop("items")(cart)))

// getNextCart :: Object -> Maybe Object -> Object
export const getNextCart = lastCart => mutation => {
  const { variantId, delta, productId, owner, subtotal, status } = mutation
  const oldQuantity = S.fromMaybe(0) (S.gets(S.is($.Number))(["items", productId, variantId])(lastCart))
  // adjust delta so we don't get invalid quantities (like negative quants)
  // delta needs to be between -oldQuantity and +Infinity
  // const adjustedDelta = S.max(S.negate(oldQuantity))(delta)
  const adjustedDelta = S.clamp(S.negate(oldQuantity))(Infinity)(delta)
  const newQuantity = oldQuantity + adjustedDelta

  if (newQuantity === oldQuantity) return lastCart

  const oldItems = S.fromMaybe({})(S.get(S.is($.Object))("items")(lastCart))
  // we "clone" the last cart and change the items. also set _id to undef so
  // it gets reset
  const newItems = newQuantity > 0 
    ? { ...oldItems, [productId]: { ...oldItems[productId], [variantId]: newQuantity } } 
    :  S.unchecked.size(oldItems[productId]) === 1 
      ? S.remove (productId) (oldItems) 
      : { ...oldItems, [productId]: S.unchecked.remove(variantId)(oldItems[productId]) }

  const newTotal = (S.fromMaybe(0)(S.get(S.is($.ValidNumber))("total")(lastCart))) + subtotal

  const nextCart = {
      owner: owner,
      created: new Date(),
      items: newItems,
      total: newTotal,
      status: status
    }

  console.log("nextCart lib/prima", nextCart)
  return nextCart
}

export const makeCartMutation = productId => variantId => delta => owner => subtotal => status => {
  return {
    delta,
    variantId,
    productId,
    owner,
    subtotal,
    status,
  }
}

export const updateProductQuantityBy = async mutation => {
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

const grabThingsByListOfIds = async (ids, thingsCollection) => {
  const objectIds = S.map(id => new ObjectId(id))(ids)
  const query = { "_id": { $in: objectIds } }
  return await thingsCollection.find(query).toArray()
}

const sortProductsVariants = product => ({...product, variants: S.sortBy (S.prop ("price")) (S.prop ("variants") (product))})

const grabCartsProducts = async (latestCart, productsCollection) => {
  const productIds = S.unchecked.keys(S.prop("items")(latestCart))
  const products = await grabThingsByListOfIds (productIds, productsCollection)
  return postProcessProducts (products)
}

const postProcessProducts = S.pipe([
  S.map(sortProductsVariants),
  S.map(p => ({ ...p, variants: S.filter(v => S.equals(S.prop("flagged") (v)) (false) )(p.variants) }))
])

///////////////////////////////////////////////////////////////////// MONGO APIS
const getThings = async(db, things) => {
  const collection = await db.collection(things)
  const options = { limit: 20 }
  const results = await collection.find({}, options)
  const stuff = await results.toArray()
  return stuff
}

const prepareJsonResponse = data =>JSON.stringify(data)

// const prepareJsonFromList = prepareJsonResponse (S.is($.Array($.Object)))

// const prepareJsonFromObject = prepareJsonResponse (S.is($.Object))

//// PRODUCTS
export const getProducts = async (db) => {
  const products = await getThings(db, 'products')
  const processedProducts = postProcessProducts (products)
  return prepareJsonResponse (processedProducts)
}

//// SOURCES
export const getSources = async (db) => {
  const sources = await getThings(db, 'sources')
  // return JSON.stringify(sources)
  return prepareJsonResponse (sources)
}

//// CARTS
export const getCart = async (db) => {
  const carts = await db.collection("carts")
  // get latest cart or seed a new one, TODO: filter by user
  const latestCart = await getLatestCart(carts)
  // return JSON.stringify({cart: latestCart})
  return prepareJsonResponse ({ cart: latestCart })
}

export const getFullCart = async (db) => {
  const carts = await db.collection("carts")
  // get latest cart or seed a new one, TODO: filter by user
  const latestCart = await getLatestCart(carts)
  const productsCollection = await db.collection("products")
  const productsInCart = await grabCartsProducts(latestCart, productsCollection)
  const fullCart = { ...latestCart, products: productsInCart}

  return prepareJsonResponse ({ cart: fullCart })
}