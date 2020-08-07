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
import { useRouter } from 'next/router'
import Link from 'next/link'

const S = require("sanctuary")
const $ = require ("sanctuary-def")

function Search({ searchResults, sources, cart }) {
  // debugger
  // const { user, loading } = useFetchUser()
  const { user, loading } = { user: { sub: "someId" }, loading: false }
  // const productList = S.get(_ => true) ("products") (products)
  // const sourceList = S.get(_ => true) ("sources") (sources)3
  const router = useRouter()
  const { query: q } = router.query

  const mbSourceList = S.get (S.is ($.Array ($.Object))) ("sources") (sources)

  console.log("cart", cart)
  const currentlyLoading = (S.isNothing(mbSourceList) || loading) 

  const products = S.get (S.is ($.Array ($.Object))) ("searchResults") (searchResults)

  return (
    <Layout user={user} loading={loading} hideHeader={!loading && !user }>

      <Pane margin={majorScale(2)} display="flex" alignItems="center" justifyContent="flex-start">
        <Link href="/">
          <Button marginRight={majorScale(1)} appearance="minimal" intent="warning" height={40} iconBefore={ArrowLeftIcon}>Voltar</Button>
        </Link>
        <Alert
          intent="warning"
          title={`Buscando ${q}`}
          flex="1"
        />
      </Pane>

      {/* {currentlyLoading && <SpinnerBox />} */}

      {!currentlyLoading && !user && <LoginBox />}

      {user && (
        <>
          
          <ProductList user={user} loading={currentlyLoading} products={S.fromMaybe ([])(products)} sources={S.fromMaybe ([]) (mbSourceList) } />

          <Totalizer loading={currentlyLoading} viewingCart={false} total={"R$ 100.099,35"} />
        </>
      )}
    </Layout>
  )
}

export default Search

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps = async (context) => {
  const { query } = context.params
  const res = await fetch(`http://localhost:3000/api/search/${query}`)
  const searchResults = await res.json()

  const resSources = await fetch(`http://localhost:3000/api/sources`)
  const sources = await resSources.json()

  return {
    props: {
      searchResults,
      sources,
    }
  }
}
