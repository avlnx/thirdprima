import Layout from "../components/layout"
import { getProducts, getSources, getCart, parseJsonFromListOfObjects, parseJsonFromObject } from "../lib/prima"
import connect from "../lib/db"
import { Alert, majorScale, Pane } from "evergreen-ui"
import ErrorResponse from "../components/errorResponse"
import { useSession, getSession } from "next-auth/client"
import SpinnerBox from "../components/spinnerBox"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

const S = require ("sanctuary")
const $ = require ("sanctuary-def")

const Home = ({ products, sources, cart: apiCart, error, msg }) => {
  const [session, loading] = useSession()
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) router.push("/auth/login")
  }, [loading, session])
  
  if (loading) return <SpinnerBox message={"Construindo sua experiência customizada"} />
  if (error) return <ErrorResponse />

  const pageDescription = <Alert
    intent="none"
    title="Olá! Eu sou a Prima. Que bom ter você aqui com a gente!"
    margin={majorScale(2)}
    appearance="card"
    isRemoveable={true}
    onRemove={() => setIsDescriptionVisible(false)}
  >Eu busco os melhores preços do momento nos fornecedores que você já confia e conhece. Você pode fazer sua compra por aqui mesmo e nós cuidamos dos detalhes do seu pedido.</Alert>

  return (<Layout session={session} products={products} msg={msg} inIndex={true} cart={apiCart.cart} sources={sources} pageDescription={isDescriptionVisible ? pageDescription : null} />)
}

export default Home

export async function getServerSideProps(context) {
  const { query } = context
  const session = await getSession(context)
  const user = S.unchecked.get(S.is($.Object))("user")(session)
  // no user, return
  if (S.isNothing(user)) return { props: { error: true } }
  const db = await connect()
  const products = parseJsonFromListOfObjects (await getProducts(db))
  const sources = parseJsonFromListOfObjects (await getSources(db))
  const cart = parseJsonFromObject (await getCart(db, session.user))

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

