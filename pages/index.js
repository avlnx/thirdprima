import { useState } from "react"
import Layout from '../components/layout'
import { useFetchUser } from '../lib/user'
import ProductList from "../components/productList"
import Paginator from "../components/paginator"
import Totalizer from "../components/totalizer"
import LoginBox from "../components/loginBox"
import { currency, updateProductQuantityBy, numberPropOrZero, getProducts, getSources, getCart } from "../lib/prima"
import nc from "next-connect"
import middleware from "../middleware/database"

const S = require("sanctuary")
const $ = require ("sanctuary-def")

function Home({ products, sources, cart: apiCart }) {
  const [ cart, setCart ] = useState (apiCart.cart)

  const { user, loading } = useFetchUser()
  const totalPrice = S.get(S.is($.FiniteNumber))("totalPrice")(cart)
  const itemCount = S.get(S.is($.FiniteNumber))("itemCount")(cart)

  console.log("cart", cart)

  const userId = S.maybeToNullable(S.get(S.is($.String))("sub")(user))

  // appendTotalsToCart :: Object -> Object
  const appendTotalsToCart = cart => {
    return { ...cart, totalPrice: numberPropOrZero(cart)("totalPrice"), itemCount: numberPropOrZero (cart) ("itemCount") }
  }

  const updateQuantityAndSetState = async ( productId, variantId, delta) => { 
    const ammendedCart = appendTotalsToCart (cart)
    const nextCart = await updateProductQuantityBy (userId, ammendedCart, productId, variantId, delta)
    setCart(nextCart.cart)
  }

  const boundUpdateQuantity = updateQuantityAndSetState.bind()

  return (
    <Layout>
      <ProductList cart={cart} updateProductQuantityBy={boundUpdateQuantity} products={ products } sources={ sources } />
      <Totalizer viewingCart={false} total={S.fromMaybe("R$ 0")(S.map(currency.format)(totalPrice))} count={numberPropOrZero (cart) ("itemCount")} />
    </Layout>
  )
}

export default Home

export async function getServerSideProps({ req, res }) {
  const handler = nc().use(middleware)
  try {
    await handler.apply(req, res);
  } catch (e) {
    console.log("erro middleware handler", e)
  }

  const products = JSON.parse(await getProducts(req.db))

  const sources = JSON.parse(await getSources(req.db))

  const cart = JSON.parse(await getCart(req.db))

  return {
    props: {
      products,
      sources,
      cart,
    }
  }
}

