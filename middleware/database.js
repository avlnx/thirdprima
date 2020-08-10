// import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const { MongoClient } = require ("mongodb")

const dbname = "seedr"

const client = new MongoClient(process.env.MONGODB_URI, {
  validateOptions: true,
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db(dbname);
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;