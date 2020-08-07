import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
import next from 'next';

const handler = nextConnect();

const S = require("sanctuary")
const $ = require("sanctuary-def")

const initialCart = {
  owner: null,
  created: new Date(),
  items: {}
}

const getLatestCart = async carts => await carts.find({}, { sort: { "_id": -1 }, limit: 1 }).toArray()

handler.use(middleware);

handler.get(async (req, res) => {
  // TODO: Filter by owner
  const carts = await req.db.collection('carts')
  
  const cart = await getLatestCart (carts)
  
  // get latest cart or seed a new one, TODO: filter by user
  // TODO: get "simples" flag here and pick appropriate price
  const latestCart = S.fromMaybe ({...initialCart}) (S.head (cart))
  
  // const cartTotal = S.pipe ([
  //   S.map (S.prop (""))
  // ]) ()

  res.status(200).json({ cart: latestCart });
});

const getNextCart = mutation => lastCart => {

  if (S.isNothing(mutation)) return lastCart

  const jMutation = S.maybeToNullable(mutation)

  const variantId = S.prop("variantId")(jMutation)
  const delta = S.prop("delta")(jMutation)
  const productId = S.prop("productId")(jMutation)

  const oldQuantity = S.gets (S.is ($.Number)) (["items", productId, variantId])(lastCart)

  const newQuantity = S.fromMaybe(0)(oldQuantity) + delta
  
  const oldItems = S.fromMaybe({})(S.get(_ => true)("items")(lastCart))

  // we "clone" the last cart and change the items. also set _id to undef so
  // it gets reset
  const nextCart = (newQuantity > 0)
    ? { ...lastCart, items: { ...oldItems, [productId]: { [variantId]: newQuantity} }, _id: undefined}
    : { ...lastCart, items: S.remove(variantId)(oldItems), _id: undefined}

  return nextCart
}


handler.post(async (req, res) => {
  // insert and return new cart state for this user
  const mutation = S.parseJson(S.is($.Object))(S.prop("body")(req))

  const carts = await req.db.collection('carts')

  const lastCart = await getLatestCart (carts)

  // TODO: confirm serverside this owner is correct
  const maybeOwner = S.map(S.prop("owner"))(mutation)

  const seedCart = {
    ...initialCart,
    "_id": undefined, // so it gets reset
    owner: S.maybeToNullable (maybeOwner),
  }

  const previousCart = S.fromMaybe(seedCart)(S.head(lastCart))

  const nextCart = getNextCart(mutation)(previousCart)

  S.isJust(mutation) ? await carts.insertOne(nextCart) : null

  res.status(200).json({ cart: nextCart });
});

export default handler;
