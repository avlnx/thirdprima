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

function Cart({ products, sources }) {
  const { user, loading } = useFetchUser()
  const productList = S.get(_ => true) ("products") (products)
  const sourceList = S.get(_ => true) ("sources") (sources)

  const [currentPage, setCurrentPage] = useState(1) // start at page 1

  const [query, setQuery] = useState('') // start "not searching"

  return (
    <Layout user={user} loading={loading} hideHeader={!loading && !user}>

      {loading && <Spinner />}

      {!loading && !user && <LoginBox />}

      {user && (
        <>

          <ProductList viewingCart={true} loading={loading} products={S.fromMaybe([])(productList)} sources={S.fromMaybe([])(sourceList)} />

          {/* <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} totalResults={S.fromMaybe(0)(dataCount)} /> */}

          <Totalizer viewingCart={true} setViewingCart={() => true} total={"R$ 100.099,35"} />
        </>
      )}
    </Layout>
  )
}

export default Cart

export const getStaticProps = async (context) => {
  // console.log("context", context.query)
  const res = await fetch(`http://localhost:3000/api/products/`)
  const products = await res.json()
  // console.log("products props", products)

  const resSources = await fetch(`http://localhost:3000/api/sources/`)
  const sources = await resSources.json()
  // console.log("sources props", sources)

  return {
    props: {
      products,
      sources,
    }
  }
}
