import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
import { last } from 'sanctuary';
import next from 'next';

const handler = nextConnect();

const S = require("sanctuary")
const $ = require("sanctuary-def")

handler.use(middleware);

handler.get(async (req, res) => {
  const carts = await req.db.collection('carts')

  const cart = await getLastCart(carts)

  // get latest cart

  // parse into a list of products with a list of variants, like /api/products

  // append the current cartState so the user only appends a migration to it and post

  // console.log("Products", products)

  // console.log(collection);
  res.status(200).json({ cart });
});

const getNextCart = mutation => lastCart => {

  if (S.isNothing(mutation)) return lastCart

  const fMutation = S.maybeToNullable(mutation)

  const variantId = S.prop("variantId")(fMutation)
  const delta = S.prop("delta")(fMutation)

  // const oldQuantity = S.fromMaybe(0)(S.unchecked.values (lastCart) (["items", variantId]))
  const oldQuantity = S.gets(_ => true)(["items", variantId])(lastCart)

  const newQuantity = S.fromMaybe(0)(oldQuantity) + delta

  const oldItems = S.fromMaybe({})(S.get(_ => true)("items")(lastCart))

  const nextItems = newQuantity > 0
    ? (S.insert(variantId)(newQuantity)(oldItems))
    : (S.remove(variantId))(oldItems)

  // const newItems = S.when(S.gt(0))

  // const newItems = S.insert (variantId) (newQuantity) (S.fromMaybe ({}) (oldItems)) // {65: 1}


  // const finalItems = S.when(S.props(["items", variantId])(newItems) <= 0) 
  //   (S.remove (variantId)) (newItems)

  return {
    owner: S.prop("owner")(fMutation),
    created: new Date(),
    items: nextItems,
  }
}

// const getLastCart = async carts => carts.find({}).sort({ _id: -1 }).limit(1);
// findOne({ $query: {}, $orderby: { $natural: -1 } })
// carts.find().skip(carts.count() - 1).toArray()


handler.post(async (req, res) => {
  // insert and return new cart state for this user
  const mutation = S.parseJson(S.is($.Object))(S.prop("body")(req))

  // get last cart
  const carts = await req.db.collection('carts')
  const lastCart = await carts.find({}).sort({ "_id": -1 }).limit(1).toArray()

  const maybeOwner = S.map(S.prop("owner"))(mutation)

  const initialCart = {
    owner: S.fromMaybe("")(maybeOwner),
    created: new Date(),
    items: {}
  }

  const previousCart = S.fromMaybe(initialCart)(S.head(lastCart))

  const nextCart = getNextCart(mutation)(previousCart)
    // const nextCart = getNextCart (lastCart) (mutation)

  S.isJust(mutation) ? await carts.insert(nextCart) : null
  // const finalCart = S.when (S.isJust (mutation)) (await carts.insert (nextCart))

  // console.log(collection);
  res.status(200).json({ cart: nextCart });
});

export default handler;
