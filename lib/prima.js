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
const initialCart = {
  owner: null,
  created: new Date(),
  items: {}
}
export const CartContext = React.createContext(initialCart)
// getNextCart :: Object -> Maybe Object -> Object
export const getNextCart = lastCart => mutation => {
  const variantId = S.prop("variantId")(mutation)
  const delta = S.prop("delta")(mutation)
  const productId = S.prop("productId")(mutation)

  const oldQuantity = S.gets(S.is($.Number))(["items", productId, variantId])(lastCart)

  const newQuantity = Math.abs (S.fromMaybe(0)(oldQuantity) + delta)

  const oldItems = S.fromMaybe({})(S.get(S.is($.Object))("items")(lastCart))

  // we "clone" the last cart and change the items. also set _id to undef so
  // it gets reset
  const newItems = newQuantity > 0 
    ? {...oldItems, [productId]: { [variantId]: newQuantity } } 
    : S.remove (variantId) (oldItems)

  const nextCart = {
      owner: lastCart.owner,
      created: new Date(),
      items: newItems,
    }

  console.log("nextCart lib/prima", nextCart)
  return nextCart
}

export const makeCartMutation = productId => variantId => delta => owner => {
  return {
    delta,
    variantId,
    productId,
    owner,
  }
}

export const updateProductQuantityBy = async (owner, previousCart, productId ,  variantId, delta) => {
  const mutation = makeCartMutation(productId)(variantId)(delta)(owner)

  const nextCart = getNextCart(previousCart)(mutation)

  // set off post
  // TODO: await for enhanced cart in response from here
  const enhancedCart = await postNextCartState(nextCart)

  // returns nextCart so we can change local state immediately 
  return enhancedCart
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
const getDb = (function (MongoClient) {
  // const { MongoClient } = require("mongodb")

  const dbname = "seedr"

  const client = new MongoClient(process.env.MONGODB_URI, {
    validateOptions: true,
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  return async function() {
    if (!client.isConnected()) await client.connect();
    return client.db(dbname);
  }
})

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
  // debugger
  const carts = await db.collection("carts")

  // get latest cart or seed a new one, TODO: filter by user
  const latestCart = await getLatestCart(carts)

  // grab cart's actual products (as opposed to just _ids)
  const productsCollection = await db.collection("products")
  const products = await grabCartsProducts(latestCart, productsCollection)()
  const [amendedProductList, itemCount, totalPrice] = addMetadataToProductList(products)(latestCart)
  const fullCart = { cart: { ...latestCart, products: amendedProductList, itemCount, totalPrice } }
  return JSON.stringify(fullCart)
}