import Layout from "../components/layout"
import ErrorResponse from "../components/errorResponse"
import { getSources, getFullCart, parseJsonFromObject, parseJsonFromListOfObjects } from "../lib/prima"
import connect from "../lib/db"
import { Alert, majorScale, minorScale, Pane, ShoppingCartIcon, Text } from "evergreen-ui"
import { useSession, signIn } from "next-auth/client"
import LoginBox from "../components/loginBox"
import SpinnerBox from "../components/spinnerBox"
import { getSession, signIn } from "next-auth/client"

const S = require ("sanctuary")

function Cart({ sources, cart: apiCart, error }) {
  const [session, loading ] = useSession()
  if (loading) return <SpinnerBox />
  if (!loading && !session) signIn("auth0")
  if (error) return <ErrorResponse />

  const pageDescription = <Alert
    intent="none"
    title={"Este é seu carrinho"}
    margin={majorScale(2)}
    appearance="card"
  >
    Se estiver tudo certo é só clicar em 'Finalizar pedido' e nossa equipe entrará em ação.</Alert>

  return (<Layout session={session} products={apiCart.cart.products} cart={apiCart.cart} sources={sources} inCart={true} pageDescription={pageDescription} />)
}

export default Cart

export async function getServerSideProps(context) {
  const db = await connect()
  const session = await getSession(context)
  const sources = parseJsonFromListOfObjects (await getSources(db))
  const cart = parseJsonFromObject (await getFullCart(db, S.prop("user") (session)))

  if (S.unchecked.any(S.isNothing)([sources, cart]))
    return { props: { error: true } }

  return {
    props: {
      sources: S.maybeToNullable(sources),
      cart: S.maybeToNullable(cart),
    }
  }
}

