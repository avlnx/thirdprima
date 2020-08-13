import Layout from '../components/layout'
import ErrorResponse from "../components/errorResponse"
import { getSources, getFullCart, parseJsonFromObject, parseJsonFromListOfObjects } from "../lib/prima"
import connect from "../lib/db"
import { Alert, majorScale, minorScale, Pane, ShoppingCartIcon, Text } from "evergreen-ui"

const S = require ("sanctuary")

function Cart({ sources, cart: apiCart, error }) {

  if (error) return <ErrorResponse />

  const pageDescription = <Alert
    intent="none"
    title={"Este é seu carrinho"}
    margin={majorScale(2)}
    appearance="card"
  >
    Se estiver tudo certo é só clicar em 'Finalizar pedido' e nossa equipe entrará em ação.</Alert>

  return (<Layout products={apiCart.cart.products} cart={apiCart.cart} sources={sources} inCart={true} pageDescription={pageDescription} />)
}

export default Cart

export async function getServerSideProps({ req, res }) {
  const db = await connect()
  const sources = parseJsonFromListOfObjects (await getSources(db))
  const cart = parseJsonFromObject (await getFullCart(db))

  if (S.unchecked.any(S.isNothing)([sources, cart]))
    return { props: { error: true } }

  return {
    props: {
      sources: S.maybeToNullable(sources),
      cart: S.maybeToNullable(cart),
    }
  }
}

