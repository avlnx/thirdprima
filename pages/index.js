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
import { currency, getNextCart, makeCartMutation, updateProductQuantityBy, postNextCartState } from "../lib/prima"

const S = require("sanctuary")
const $ = require ("sanctuary-def")

function Home({ products, sources, incomingCart }) {
  const [ cart, setCart ] = useState (incomingCart)

  const productList = S.get(_ => true) ("products") (products)
  const sourceList = S.get(_ => true) ("sources") (sources)

  const { user, loading } = useFetchUser()
  // const productList = S.get(S.is($.Array($.Object)))("products")(cart)
  // const sourceList = S.get(S.is($.Array($.Object)))("sources")(sources)
  const totalPrice = S.get(S.is($.FiniteNumber))("totalPrice")(cart)
  const itemsInCart = S.get(S.is($.FiniteNumber))("itemsInCart")(cart)

  console.log("cart", cart)

  return (
    <Layout>
        
      <ProductList cart={cart} updateProductQuantityBy={updateProductQuantityBy} products={ S.fromMaybe ([]) (productList) } sources={ S.fromMaybe ([]) (sourceList) } />

      <Totalizer viewingCart={false} total={S.fromMaybe("R$ 0")(S.map(currency.format)(totalPrice))} />
        
    </Layout>
  )
}

export default Home

export const getStaticProps = async (context) => {
  // console.log("context", context.query)
  
  const res = await fetch(`http://localhost:3000/api/products/`)
  const products = await res.json()
  // console.log("products props", products)

  const resSources = await fetch(`http://localhost:3000/api/sources/`)
  const sources = await resSources.json()
  // console.log("sources props", sources)

  const cartRes = await fetch(`http://localhost:3000/api/cart/`)
  const cart = await cartRes.json()

  return {
    props: {
      products,
      sources,
      cart,
    }
  }
}
