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

const S = require("sanctuary")
const $ = require("sanctuary-def")

function Cart({ sources, cart }) {
  const { user, loading } = useFetchUser()
  const productList = S.get(_ => true) ("products") (cart)
  const sourceList = S.get(_ => true) ("sources") (sources)

  return (
    <Layout loading={loading} hideHeader={!loading && !user}>
      {!loading && user && (
        <>
          <ProductList viewingCart={true} loading={loading} products={S.fromMaybe([])(productList)} sources={S.fromMaybe([])(sourceList)} />
          <Totalizer viewingCart={true} total={"R$ 100.099,35"} />
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
      cart
    }
  }
}
