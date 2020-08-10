const S = require("sanctuary")
const $ = require("sanctuary-def")


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
// getNextCart :: Object -> Maybe Object -> Object
export const getNextCart = lastCart => mutation => {
  const variantId = S.prop("variantId")(mutation)
  const delta = S.prop("delta")(mutation)
  const productId = S.prop("productId")(mutation)

  const oldQuantity = S.gets(S.is($.Number))(["items", productId, variantId])(lastCart)

  const newQuantity = S.fromMaybe(0)(oldQuantity) + delta
  // const newQuantity = oldQuantity + delta

  const oldItems = S.fromMaybe({})(S.get(S.is($.Object))("items")(lastCart))

  // we "clone" the last cart and change the items. also set _id to undef so
  // it gets reset
  // TODO: refactor with S.insert
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

export const updateProductQuantityBy = owner => previousCart => productId => variantId => delta => {
  const nextCart = getNextCart(previousCart)(makeCartMutation(owner)(productId)(variantId)(delta))

  // set off post
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
}