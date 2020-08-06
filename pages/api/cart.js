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

handler.use(middleware);

handler.get(async (req, res) => {
  // TODO: Filter by owner
  const carts = await req.db.collection('carts')

  const cart = await getLatestCart (carts)

  // get latest cart
  const latestCart = S.fromMaybe ({...initialCart}) (S.head (cart))

  const intItemIds = S.pipe ([
    S.get (_ => true) ("items"),
    S.fromMaybe({}),
    S.keys,
    S.map(S.parseInt(10)),
    S.map (S.fromMaybe (-1))  // ids should parse but you know
  ]) (latestCart)

  const query = { id: { $in: intItemIds } }
  const options = {
    projection: {id: 1, label: 1, variants: 1}
  }

  const itemsInCart = await req.db.collection('products').find(query, options).toArray(); // TODO: change id to _id after clean
  console.log("itemsInCart", itemsInCart)

  // const cartTotal = S.pipe ([
  //   S.map (S.prop (""))
  // ]) ()

  res.status(200).json({ cart: latestCart, products: itemsInCart });
});

// const get
const makeInt = str => S.fromMaybe (-1) (S.parseInt (10) (str))

const getNextCart = mutation => lastCart => {

  if (S.isNothing(mutation)) return lastCart

  const fMutation = S.maybeToNullable(mutation)

  const variantId = makeInt (S.prop("variantId")(fMutation))
  const delta = S.prop("delta")(fMutation)
  const productId = makeInt (S.prop("productId")(fMutation))

  const oldQuantity = S.gets (S.is ($.Number)) (["items", productId, variantId])(lastCart)

  console.log(oldQuantity)

  const newQuantity = S.fromMaybe(0)(oldQuantity) + delta

  const oldItems = S.fromMaybe({})(S.get(_ => true)("items")(lastCart))

  // productId should be a number for now
  const productsItem = S.fromMaybe({})(S.get(_ => true) (productId) (oldItems))

  const nextProductItems = newQuantity > 0
    ? (S.insert (variantId) (newQuantity) (productsItem))
    : (S.remove (variantId)) (productsItem)
  
  // now insert the new productItem into the items
  const newItems = (S.gt(0) (S.size(nextProductItems)))
    ? (S.insert (productId) (productsItem) (oldItems))
    : (S.remove (productId) (oldItems))

  return {
    owner: S.prop("owner")(fMutation),
    created: new Date(),
    items: newItems,
  }
}

const getLatestCart = async carts => carts.find({}).sort({ "_id": -1 }).limit(1).toArray()

handler.post(async (req, res) => {
  // insert and return new cart state for this user
  const mutation = S.parseJson(S.is($.Object))(S.prop("body")(req))

  // get last cart TODO: send in from post so we don't need to query this
  // remember, this needs to be FAST, we run it for every "add to cart" click
  const carts = await req.db.collection('carts')
  const lastCart = await carts.find({}).sort({ "_id": -1 }).limit(1).toArray()

  const maybeOwner = S.map(S.prop("owner"))(mutation)

  const seedCart = {
    ...initialCart,
    owner: S.fromMaybe("")(maybeOwner),
  }

  const previousCart = S.fromMaybe(seedCart)(S.head(lastCart))

  const nextCart = getNextCart(mutation)(previousCart)
    // const nextCart = getNextCart (lastCart) (mutation)

  S.isJust(mutation) ? await carts.insertOne(nextCart) : null
  // const finalCart = S.when (S.isJust (mutation)) (await carts.insert (nextCart))

  // console.log(collection);
  res.status(200).json({ cart: nextCart });
});

export default handler;
