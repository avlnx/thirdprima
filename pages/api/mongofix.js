import nextConnect from 'next-connect';
import middleware from '../../middleware/database';

const handler = nextConnect();

const S = require ("sanctuary")
const $ = require ("sanctuary-def")

const btoa = require ("btoa")

const {ObjectId} = require ("mongodb")

handler.use(middleware);

const renameProperty = prop => newProp => obj => {
  // inserts old prop's value as the newProp
  const objWithNewProp = S.unchecked.insert (newProp) (S.prop (prop) (obj)) (obj)
  return S.unchecked.remove(prop)(objWithNewProp)
}


const hashVariant = v => {
  const sourceStr = ObjectId(S.prop ("source") (v))
  const str = btoa(`${S.prop("label")(v)}${S.prop("pack_label")(v)}${sourceStr}`)
  console.log(str)
  return str
  // return hash(str)
}

// const producedVariants = JSON.parse(require("/home/yonedalemma/dev/prima-json-dumps/produced-variants.json"))

handler.get(async (req, res) => {
  const options = { sort: { id: 1 } }
  const c1 = await req.db.collection('sources')
  const sources = await c1.find({}, options).toArray()
  
  const c2 = await req.db.collection('products')
  const products = await c2.find({}, options).toArray()
  
  const c = await req.db.collection('oldVariants')
  const variants = await c.find({}, options).toArray()
  

  const renamedVariants = S.pipe([
    S.map(renameProperty("id")("django_id")),
    S.map(renameProperty("source")("django_source_id")),
    S.map(renameProperty ("product") ("django_product_id")),
  ]) (variants)

  const sourcedVariants = S.map (v => {
    const sourceId = S.prop ("django_source_id") (v)
    const source = S.find (s => S.equals (S.prop ("id") (s)) (sourceId)) (sources)
    if (S.isNothing (source)) return v
    return S.unchecked.insert("source")(ObjectId(S.prop("_id")(S.maybeToNullable(source)))) (v)
  }) (renamedVariants)

  const producedVariants = S.map(v => {
    const productId = S.prop("django_product_id")(v)
    const product = S.find(p => p["id"] === productId) (products)
    if (S.isNothing(product)) return v
    let p = S.maybeToNullable (product)
    v.product = ObjectId(p["_id"])
    // return S.unchecked.insert("product")(ObjectId(S.prop("_id")(S.maybeToNullable(product))))(v)
    return v
  })(sourcedVariants)

  const jsonProductVariants = JSON.stringify (producedVariants)

  const identifiedVariants = S.map(v => {
    const identifier = hashVariant (v)
    // return S.unchecked.insert("imported_identifier")(identifier)(v)
    v["imported_identifier"] = identifier
    return v
  })(producedVariants)

  const jsonIdentifiedVariants = JSON.stringify (identifiedVariants)

  const bulkData = S.map(v => {
    return { insertOne:
      {
        "document": v
      }
    }
  }) (identifiedVariants)

  

  const vCollection = await req.db.collection('variants')
  const result = await vCollection.bulkWrite(bulkData)


  res.status(200).json({result, identifiedVariants});
});

export default handler;