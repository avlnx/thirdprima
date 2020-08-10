import { useState } from "react"
import Layout from '../components/layout'
import { useFetchUser } from '../lib/user'
import ProductList from "../components/productList"
import Paginator from "../components/paginator"
import Totalizer from "../components/totalizer"
import LoginBox from "../components/loginBox"
import { currency, getNextCart, makeCartMutation, updateProductQuantityBy, postNextCartState, numberPropOrZero } from "../lib/prima"

const S = require("sanctuary")
const $ = require ("sanctuary-def")

function Home({ products, sources, cart: apiCart }) {
  const [ cart, setCart ] = useState (apiCart.cart)

  const productList = S.get(S.is($.Array($.Object))) ("products") (products)
  const sourceList = S.get (S.is ($.Array ($.Object))) ("sources") (sources)

  const { user, loading } = useFetchUser()
  const totalPrice = S.get(S.is($.FiniteNumber))("totalPrice")(apiCart)
  const itemsInCart = S.get(S.is($.FiniteNumber))("itemsInCart")(apiCart)

  console.log("cart", cart)

  const userId = S.maybeToNullable(S.get(S.is($.String))("sub")(user))

  // appendTotalsToCart :: Object -> Object
  const appendTotalsToCart = cart => {
    return { ...cart, totalPrice: numberPropOrZero(apiCart)("totalPrice"), itemCount: numberPropOrZero (apiCart) ("itemCount") }
  }

  const updateQuantityAndSetState = productId => variantId => delta => { 
    const ammendedCart = appendTotalsToCart (cart)
    const nextCart = updateProductQuantityBy (userId) (ammendedCart) (productId) (variantId) (delta)
    setCart(nextCart)
  }

  const boundUpdateQuantity = updateQuantityAndSetState.bind()

  return (
    <Layout>
      <ProductList cart={cart} updateProductQuantityBy={boundUpdateQuantity} products={ S.fromMaybe ([]) (productList) } sources={ S.fromMaybe ([]) (sourceList) } />
      <Totalizer viewingCart={false} total={S.fromMaybe("R$ 0")(S.map(currency.format)(totalPrice))} />
    </Layout>
  )
}

export default Home

export const getStaticProps = async (context) => {
  
  const res = await fetch(`http://localhost:3000/api/products/`)
  const products = await res.json()
  // console.log("products props", products)

  const resSources = await fetch(`http://localhost:3000/api/sources/`)
  const sources = await resSources.json()
  // console.log("sources props", sources)

  const cartRes = await fetch(`http://localhost:3000/api/cart/?full=true`)
  const cart = await cartRes.json()

  return {
    props: {
      products,
      sources,
      cart,
    }
  }
}
