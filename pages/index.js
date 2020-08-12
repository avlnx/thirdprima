import { useState } from "react"
import Layout from '../components/layout'
import { useFetchUser } from '../lib/user'
import ProductList from "../components/productList"
import Paginator from "../components/paginator"
import Totalizer from "../components/totalizer"
import LoginBox from "../components/loginBox"
import { currency, updateProductQuantityBy, numberPropOrZero, getProducts, getSources, getCart, CartContext } from "../lib/prima"
import nc from "next-connect"
import connect from "../middleware/database"
const S = require("sanctuary")
const $ = require ("sanctuary-def")

function Home({ products, sources, cart: apiCart }) {
  const [cart, setCart] = useState(apiCart)

  // const { user, loading } = useFetchUser()
  const user = {"sub": "balls"}
  const total = S.get(S.is($.FiniteNumber))("total")(cart)
  // const itemCount = S.get(S.is($.FiniteNumber))("itemCount")(cart)

  console.log("cart", cart)

  const userId = S.maybeToNullable(S.get(S.is($.String))("sub")(user))

  // appendTotalsToCart :: Object -> Object
  const appendTotalsToCart = c => {
    return { ...cart, total: numberPropOrZero(c)("total"), itemCount: numberPropOrZero (c) ("itemCount") }
  }

  const updateQuantityAndSetState = async ( productId, variantId, delta, subtotal) => { 
    const nextCart = await updateProductQuantityBy (userId, cart, productId, variantId, delta, subtotal)
    setCart(nextCart)
  }

  const boundUpdateQuantity = updateQuantityAndSetState.bind()

  return (
    <Layout>
      <CartContext.Provider value={cart}>
        <ProductList updateProductQuantityBy={boundUpdateQuantity} products={products} sources={sources} />
        <Totalizer viewingCart={false} total={S.fromMaybe("R$ 0")(S.map(currency.format)(total))} count={numberPropOrZero (cart) ("itemCount")} />
      </CartContext.Provider>
    </Layout>
  )
}

export default Home

export async function getServerSideProps({ req, res }) {
  // const handler = nc().use(middleware)
  // try {
  //   await handler.apply(req, res);
  // } catch (e) {
  //   console.log("erro middleware handler", e)
  // }

  const db = await connect()

  const products = JSON.parse(await getProducts(db))

  const sources = JSON.parse(await getSources(db))

  const cart = JSON.parse(await getCart(db))
  console.log("cart from getServerSideProps", cart)
  // debugger
  return {
    props: {
      products,
      sources,
      cart,
    }
  }
}

