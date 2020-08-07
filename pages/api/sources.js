import nextConnect from 'next-connect';
import middleware from '../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const collection = await req.db.collection('sources')

  const sources = await collection.find({}).toArray()
  
  res.status(200).json({ sources });
});

export default handler;