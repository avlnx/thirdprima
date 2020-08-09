const S = require ("sanctuary")
const $ = require ("sanctuary-def")


////////////////////////////////////////////////////////////////////////// LISTS
export const id = S.prop("_id")

export const findByIdInList = objId => S.find(obj => S.equals(id(obj))(objId))


//////////////////////////////////////////////////////////////////////// NUMBERS
export const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})


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

  const jMutation = S.maybeToNullable(mutation)

  const variantId = S.prop("variantId")(jMutation)
  const delta = S.prop("delta")(jMutation)
  const productId = S.prop("productId")(jMutation)
  // const variantId = S.map (S.prop("variantId")) (mutation)
  // const delta = S.map (S.prop("delta")) (mutation)
  // const productId = S.map (S.prop("productId")) (mutation)

  const oldQuantity = S.gets(S.is($.Number))(["items", productId, variantId])(lastCart)

  const newQuantity = S.fromMaybe(0)(oldQuantity) + delta
  // const newQuantity = oldQuantity + delta

  const oldItems = S.fromMaybe({})(S.get(S.is($.Array($.Object)))("items")(lastCart))

  // we "clone" the last cart and change the items. also set _id to undef so
  // it gets reset
  // TODO: refactor with S.insert
  const nextCart = (newQuantity > 0)
    ? { ...lastCart, items: { ...oldItems, [productId]: { [variantId]: newQuantity } }, _id: undefined }
    : { ...lastCart, items: S.remove(variantId)(oldItems), _id: undefined }

  console.log("nextCart server", nextCart)
  return nextCart
}

export const makeCartMutation = productId => variantId => delta => S.Just ({
  delta: delta,
  variantId: variantId,
  productId: productId,
  owner: S.get(S.is($.Object))("sub")(user),
})

export const updateProductQuantityBy = previousCart => productId => variantId => delta => {
  const nextCart = getNextCart(previousCart)(makeCartMutation(productId, variantId, delta))

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
  console.log("nextCart", res)
}