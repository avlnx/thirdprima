// import { useState } from "react"
import Layout from '../components/layout'
// import { useRouter } from 'next/router'
// import { useFetchUser } from '../../lib/user'
import {
  Alert,
  ArrowLeftIcon,
  Button,
  majorScale,
  Pane,
  Spinner,
} from "evergreen-ui"
// import BlockSwitch from "../../components/switch"
// import ProductList from "../../components/productList"
// import Paginator from "../../components/paginator"
// import Totalizer from "../../components/totalizer"
// import LoginBox from "../../components/loginBox"
// import SpinnerBox from "../../components/spinnerBox"
import ErrorResponse from "../components/errorResponse"
import connect from "../lib/db"
import { parseJsonFromListOfObjects, parseJsonFromObject, getSources, getCart } from "../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

function Search({ products, sources, cart: apiCart, query, error }) {

  if (error) return <ErrorResponse />

  const pageDescription = <Alert
    intent="none"
    title={`Buscando ${query.keyword}`}
    margin={majorScale(2)}
    appearance="card" />

  return (<Layout products={products} cart={apiCart.cart} sources={sources} inSearch={true} pageDescription={pageDescription} />)
}

export default Search

export async function getServerSideProps({ query }) {
  debugger
  // const router = useRouter()
  // console.log(router.query);
  const searchQuery = S.fromMaybe("") (S.value ("keyword") (query))
  const db = await connect()
  const collection = await db.collection('products')
  const q = { $text: { $search: query } }
  const products = parseJsonFromListOfObjects (JSON.stringify(await collection.find({ $text: { $search: searchQuery } }).toArray()))
  const sources = parseJsonFromListOfObjects(await getSources(db))
  //oko
  const cart = parseJsonFromObject(await getCart(db))
  if (S.unchecked.any(S.isNothing)([sources, cart, products]))
    return { props: { error: true } }

  return {
    props: {
      products: S.maybeToNullable(products),
      sources: S.maybeToNullable(sources),
      cart: S.maybeToNullable(cart),
      query: query,
    }
  }
}
