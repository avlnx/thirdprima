import { useState } from "react"
import Layout from '../../components/layout'
import { useFetchUser } from '../../lib/user'
import {
  Alert,
  ArrowLeftIcon,
  Button,
  majorScale,
  Pane,
  Spinner,
} from "evergreen-ui"
import BlockSwitch from "../../components/switch"
import ProductList from "../../components/productList"
import Paginator from "../../components/paginator"
import Totalizer from "../../components/totalizer"
import LoginBox from "../../components/loginBox"
import SpinnerBox from "../../components/spinnerBox"

const S = require("sanctuary")
const $ = require("sanctuary-def")

function Search({ searchResults, sources, cart: apiCart, query }) {

  const mbSourceList = S.get(S.is($.Array($.Object)))("sources")(sources)

  console.log("cart", cart)
  const currentlyLoading = (S.isNothing(mbSourceList) || loading)

  const products = S.get(S.is($.Array($.Object)))("products")(searchResults)

  return (<Layout inSearch={true} products={products} cart={apiCart.cart} sources={sources} />)
  // <Layout user={user} loading={loading} hideHeader={!loading && !user }>

  //   <Pane margin={majorScale(2)} display="flex" alignItems="center" justifyContent="flex-start">
  //     <Link href="/">
  //       <Button marginRight={majorScale(1)} appearance="minimal" intent="warning" height={40} iconBefore={ArrowLeftIcon}>Voltar</Button>
  //     </Link>
  //     <Alert
  //       intent="warning"
  //       title={`Buscando ${q}`}
  //       flex="1"
  //     />
  //   </Pane>

  //   {/* {currentlyLoading && <SpinnerBox />} */}

  //   {!currentlyLoading && !user && <LoginBox />}

  //   {user && (
  //     <>

  //       <ProductList user={user} loading={currentlyLoading} products={S.fromMaybe ([])(products)} sources={S.fromMaybe ([]) (mbSourceList) } />

  //       <Totalizer loading={currentlyLoading} viewingCart={false} total={"R$ 100.099,35"} />
  //     </>
  //   )}
  // </Layout>
}

export default Search

export async function getServerSideProps({ req, res }) {
  debugger
  const query = req.query.query

  const db = await connect()

  const collection = await db.collection('products')

  // const queryString = { $text: { $search: q } }
  const q = { $text: { $search: query } }

  const products = await collection.find({ $text: { $search: query } }).toArray()

  // debugger
  // res.status(200).json({ products: products });

  const sources = JSON.parse(await getSources(db))

  const cart = JSON.parse(await getCart(db))



  // const cart = JSON.parse(await getCart(db))

  return {
    props: {
      products,
      sources,
      cart,
    }
  }
}

// export const getStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: true
//   }
// }

// export const getStaticProps = async (context) => {
//   const { query } = context.params
//   const res = await fetch(`http://localhost:3000/api/search/${query}`)
//   const searchResults = await res.json()

//   const resSources = await fetch(`http://localhost:3000/api/sources`)
//   const sources = await resSources.json()

//   return {
//     props: {
//       searchResults,
//       sources,
//     }
//   }
// }
