import { useState } from "react"
import Layout from '../components/layout'
import { useFetchUser } from '../lib/user'
import {
  Spinner,
} from "evergreen-ui"
import BlockSwitch from "../components/switch"
import ProductList from "../components/productList"
import Paginator from "../components/paginator"
import Totalizer from "../components/totalizer"
import LoginBox from "../components/loginBox"
import { currency, updateProductQuantityBy } from "../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

function Cart({ sources, lastCart }) {
  console.log("cart", lastCart)

  const { cart, setNextCart } = useState(lastCart)

  const { user, loading } = useFetchUser()
  const productList = S.get(S.is ($.Array ($.Object))) ("products") (cart)
  const sourceList = S.get(S.is ($.Array ($.Object))) ("sources") (sources)
  const totalPrice = S.get(S.is ($.FiniteNumber))("totalPrice")(cart)
  const itemsInCart = S.get(S.is ($.FiniteNumber))("itemsInCart")(cart)
  // debugger

  // getNextCart :: Object -> Maybe Object -> Object
  // export const getNextCart = lastCart => mutation => {

  
  
  // const updateProductQuantityBy = productId => variantId => delta => {
  //   const nextCart = getNextCart (cart) (makeCartMutation(productId, variantId, delta))

  //   // set off post
  //   postNextCartState (nextCart)

  //   // change local state immediately 
  //   setNextCart (nextCart)
  // }

  // const postNextCartState = async (nextCart) => {
  //   // setQuantity(S.max(0)(quantity + delta))
  //   const res = await fetch("/api/cart", {
  //     method: "post",
  //     body: JSON.stringify(nextCart)
  //   })
  //   console.log("nextCart", res)
  // }
 
  return (
    <Layout loading={loading} hideHeader={!loading && !user}>
      {!loading && user && (
        <>
          <ProductList cart={cart} updateProductQuantityBy={updateProductQuantityBy} viewingCart={true} loading={loading} products={S.fromMaybe([])(productList)} sources={S.fromMaybe([])(sourceList)} />
          <Totalizer viewingCart={true} total={S.fromMaybe("R$ 0")(S.map (currency.format) (totalPrice))} />
        </>
      )}
    </Layout>
  )
}


export default Cart

export const getServerSideProps = async (context) => {
  // console.log("context", context.query)
  // const res = await fetch(`http://localhost:3000/api/products/`)
  // const products = await res.json()
  // console.log("products props", products)

  const resSources = await fetch(`http://localhost:3000/api/sources/`)
  const sources = await resSources.json()
  // console.log("sources props", sources)

  const cartRes = await fetch(`http://localhost:3000/api/cart/`)
  const cart = await cartRes.json()

  return {
    props: {
      // products,
      sources,
      cart,
    },
  }
}
