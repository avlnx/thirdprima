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
const $ = require ("sanctuary-def")

function Home({ products, sources }) {
  // const { user, loading } = useFetchUser()
  const productList = S.get(_ => true) ("products") (products)
  const sourceList = S.get(_ => true) ("sources") (sources)

  // console.log("products in Home", products)
  const { user, loading }  = {
    user: {"name": "Thyago", "email": "tdasilva@tuta.io"}, loading: false
  }

  const [currentPage, setCurrentPage] = useState(1) // start at page 1

  const [query, setQuery] = useState('') // start "not searching"

  const [viewingCart, setViewingCart] = useState(false)

  return (
    <Layout user={user} loading={loading} hideHeader={!loading && !user }>

      {loading && <Spinner />}

      {!loading && !user && <LoginBox />}

      {user && (
        <>
          <BlockSwitch checked={viewingCart} onChange={() => setViewingCart(!viewingCart)} />

          <ProductList viewingCart={viewingCart} loading={loading} products={ S.fromMaybe ([]) (productList) } sources={ S.fromMaybe ([]) (sourceList) } />

          {/* <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} totalResults={S.fromMaybe(0)(dataCount)} /> */}

          <Totalizer viewingCart={viewingCart} setViewingCart={setViewingCart} total={"R$ 100.099,35"} />
        </>
      )}

      {/* <h1>Next.js and Auth0 Example</h1>

      {loading && <p>Loading login info...</p>}

      {!loading && !user && (
        <>
          <p>
            To test the login click in <i>Login</i>
          </p>
          <p>
            Once you have logged in you should be able to click in{' '}
            <i>Profile</i> and <i>Logout</i>
          </p>
        </>
      )}

      {user && (
        <>
          <h4>Rendered user info on the client</h4>
          <img src={user.picture} alt="user picture" />
          <p>nickname: {user.nickname}</p>
          <p>name: {user.name}</p>
        </>
      )} */}
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

  return {
    props: {
      products,
      sources,
    }
  }
}
