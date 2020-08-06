import nextConnect from 'next-connect';
import middleware from '../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const collection = await req.db.collection('products')

  const products = await collection.find().limit(2).toArray()

  
  const productsVariants = await req.db.collection('variants').find()

  // console.log("Products", products)

  // console.log(collection);
  res.status(200).json({ products });
});

export default handler;