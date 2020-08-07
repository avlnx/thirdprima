import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
//    "dev": "NODE_OPTIONS='--inspect' next",
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const collection = await req.db.collection('products')

  const options = { limit: 20 }
  const products = await collection.find({}, options).toArray()

  // console.log(collection);
  res.status(200).json({ products });
});

export default handler;
