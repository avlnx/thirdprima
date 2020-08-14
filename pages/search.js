import Layout from "../components/layout"
import {
  Alert,
  ArrowLeftIcon,
  Button,
  majorScale,
  Pane,
  Spinner,
} from "evergreen-ui"
import LoginBox from "../../components/loginBox"
import ErrorResponse from "../components/errorResponse"
import connect from "../lib/db"
import { parseJsonFromListOfObjects, parseJsonFromObject, getSources, getCart } from "../lib/prima"
import { useSession } from "next-auth/client"

const S = require("sanctuary")
const $ = require("sanctuary-def")

function Search({ products, sources, cart: apiCart, query, error }) {
  const [session, loading] = useSession()
  if (!session) return <LoginBox />

  if (error) return <ErrorResponse />

  const pageDescription = <Alert
    intent="none"
    title={`Buscando ${query.keyword}`}
    margin={majorScale(2)}
    appearance="card" />

  return (<Layout products={products} cart={apiCart.cart} sources={sources} inSearch={true} pageDescription={pageDescription} />)
}

export default Search

export async function getServerSideProps({ query }) {
  const searchQuery = S.fromMaybe("") (S.value ("keyword") (query))
  const db = await connect()
  const collection = await db.collection("products")
  const products = parseJsonFromListOfObjects (JSON.stringify(await collection.find({ $text: { $search: searchQuery } }).toArray()))
  
  const sources = parseJsonFromListOfObjects(await getSources(db))
  const cart = parseJsonFromObject(await getCart(db))
  if (S.unchecked.any(S.isNothing)([sources, cart, products]))
    return { props: { error: true } }

  return {
    props: {
      products: S.maybeToNullable(products),
      sources: S.maybeToNullable(sources),
      cart: S.maybeToNullable(cart),
      query: query,
    }
  }
}
