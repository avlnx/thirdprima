import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const S = require ("sanctuary")
const $ = require ("sanctuary-def")

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  // TODO: fix empty and multiple words search
  
  const query = req.query.query
  
  const collection = await req.db.collection('products')
  
  // const queryString = { $text: { $search: q } }
  const q = { $text: { $search: query } }
  
  const products = await collection.find({ $text: { $search: query }}).toArray()
  
  // debugger
  res.status(200).json({ searchResults: products });
});

export default handler;