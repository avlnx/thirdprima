import Layout from "../components/layout"
import { getProducts, getSources, getCart, parseJsonFromListOfObjects, parseJsonFromObject } from "../lib/prima"
import connect from "../lib/db"
import { Alert, majorScale, Pane } from "evergreen-ui"
import ErrorResponse from "../components/errorResponse"
import { useSession } from "next-auth/client"
import LoginBox from "../components/loginBox"

const S = require ("sanctuary")
const $ = require ("sanctuary-def")

const Home = ({ products, sources, cart: apiCart, error, msg }) => {
  const [session, loading] = useSession()
  if (!session) return <LoginBox />

  if (error) return <ErrorResponse />

  const pageDescription = <Alert
    intent="none"
    title="Olá! Eu sou a Prima. Que bom ter você aqui com a gente!"
    margin={majorScale(2)}
    appearance="card"
  >Eu busco os melhores preços do momento nos fornecedores que você já confia e conhece. Você pode fazer sua compra por aqui mesmo e nós cuidamos dos detalhes do seu pedido.</Alert>

  return (<Layout products={products} msg={msg} inIndex={true} cart={apiCart.cart} sources={sources} pageDescription={pageDescription} />)
}

export default Home

export async function getServerSideProps({ req, res, query }) {
  const db = await connect()
  const products = parseJsonFromListOfObjects (await getProducts(db))
  const sources = parseJsonFromListOfObjects (await getSources(db))
  const cart = parseJsonFromObject (await getCart(db))

  if (S.unchecked.any(S.isNothing) ([products, sources, cart]))
    return { props: { error: true}}

  return {
    props: {
      products: S.maybeToNullable (products),
      sources: S.maybeToNullable (sources),
      cart: S.maybeToNullable (cart),
      msg: S.fromMaybe("") (S.value ("msg") (query)),
    }
  }
}

