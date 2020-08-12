import { useState } from "react"
import Layout from '../components/layout'
import { useFetchUser } from '../lib/user'
import ProductList from "../components/productList"
import Paginator from "../components/paginator"
import Totalizer from "../components/totalizer"
import LoginBox from "../components/loginBox"
import { currency, updateProductQuantityBy, numberPropOrZero, getProducts, getSources, getCart, CartContext } from "../lib/prima"
import connect from "../lib/db"
const S = require("sanctuary")
const $ = require ("sanctuary-def")

function Home({ products, sources, cart: apiCart }) {
  const [cart, setCart] = useState(apiCart.cart)

  const { user, loading } = useFetchUser()
  // const user = {"sub": "balls"}
  const total = S.get(S.is($.FiniteNumber))("total")(cart)
  
  const cartItemsCount = S.pipe ([
    S.prop ("items"),
    S.values,
    S.chain(S.values),
    S.sum,
  ]) (cart)

  console.log("cart", cart)

  const userId = S.maybeToNullable(S.get(S.is($.String))("sub")(user))

  const updateQuantityAndSetState = async ( productId, variantId, delta, subtotal) => { 
    const nextCart = await updateProductQuantityBy (userId, cart, productId, variantId, delta, subtotal)
    setCart(nextCart)
  }

  const boundUpdateQuantity = updateQuantityAndSetState.bind()

  return (
    <Layout>
      <CartContext.Provider value={cart}>
        <ProductList updateProductQuantityBy={boundUpdateQuantity} products={products} sources={sources} />
        <Totalizer viewingCart={false} total={S.fromMaybe("R$ 0")(S.map(currency.format)(total))} count={cartItemsCount} />
      </CartContext.Provider>
    </Layout>
  )
}

export default Home

export async function getServerSideProps({ req, res }) {
  const db = await connect()

  const products = JSON.parse(await getProducts(db))

  const sources = JSON.parse(await getSources(db))

  const cart = JSON.parse(await getCart(db))

  return {
    props: {
      products,
      sources,
      cart,
    }
  }
}

