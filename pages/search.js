import Layout from "../components/layout"
import {
  Alert,
  ArrowLeftIcon,
  Button,
  majorScale,
  Pane,
  Spinner,
} from "evergreen-ui"
import LoginBox from "../components/loginBox"
import SpinnerBox from "../components/spinnerBox"
import ErrorResponse from "../components/errorResponse"
import connect from "../lib/db"
import { parseJsonFromListOfObjects, parseJsonFromObject, getSources, getCart } from "../lib/prima"
import { useSession, getSession } from "next-auth/client"
import { useRouter } from "next/router"

const S = require("sanctuary")
const $ = require("sanctuary-def")

function Search({ products, sources, cart: apiCart, query, error }) {
  const [session, loading] = useSession()
  const router = useRouter()
  if (loading) return <SpinnerBox />
  if (!loading && !session) router.push("/auth/login")
  if (error) return <ErrorResponse />
  
  // if (!session) router.push("/auth/login")
  // if (!loading && !session) return <LoginBox />
  
  const pageDescription = <Alert
    intent="none"
    title={`Buscando ${query.keyword}`}
    margin={majorScale(2)}
    appearance="card" />

  return (<Layout session={session} products={products} cart={apiCart.cart} sources={sources} inSearch={true} pageDescription={pageDescription} />)
}

export default Search

export async function getServerSideProps(context) {
  const { query } = context
  const session = await getSession(context)
  const user = S.unchecked.value("user")(session)
  const searchQuery = S.fromMaybe("") (S.value ("keyword") (query))
  const db = await connect()
  const collection = await db.collection("products")
  const products = parseJsonFromListOfObjects(JSON.stringify(await collection.find({ $text: { $search: searchQuery }, "variants": { $not: { $size: 0 } }}).toArray()))
  
  const sources = parseJsonFromListOfObjects(await getSources(db))
  const cart = parseJsonFromObject(await getCart(db, S.fromMaybe({})(user)))
  if (S.unchecked.any(S.isNothing)([sources, cart, products]))
    return { props: { error: true } }

  return {
    props: {
      products: S.maybeToNullable(products),
      sources: S.maybeToNullable(sources),
      cart: S.maybeToNullable(cart),
      query: query,
      session: session,
    }
  }
}
