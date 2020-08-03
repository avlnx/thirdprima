import Head from 'next/head'
import Header from './header'
import { useState } from "react"
import Paginator from "./paginator"

import { palette, brand, primaTheme } from "../theme"
import {
  Alert,
  ArrowRightIcon,
  Badge,
  Button,
  Card,
  Heading,
  LockIcon,
  majorScale,
  minorScale,
  Pane,
  ShoppingCartIcon,
  Spinner,
  Switch,
  Table,
  Text,
  TextInputField,
  ThemeProvider,
} from 'evergreen-ui'
import ProductList from './productList'
import Totalizer from './totalizer'

const S = require('sanctuary')

const Layout = ({ user, loading = false, children, products, hideHeader }) => {
  const [viewingCart, setViewingCart] = useState(false)
  const [currentPage, setCurrentPage] = useState(1) // start at page 1
  const [query, setQuery] = useState('') // start "not searching"

  const apiEndpointGivenCurrentState = `http://localhost:9000/api/products/?page=${currentPage}${query ? "&search=" + query : ''}`

  // const { data, error } = useSWR ([apiEndpointGivenCurrentState, token], tokenFetcher, {"shouldRetryOnError": false})

  const getCount = S.get(_ => true)("count")
  const dataCount = getCount(products)  // Maybe(1000)

  const getResults = S.get(_ => true)("results")
  const dataResultsCount = S.maybe(0)(S.size)(getResults(products))  // 0 or 50 for example

  const numPages = Math.ceil(S.maybe(0)(n => S.div(dataResultsCount)(n))(dataCount))

  return (
    <>
      <Head>
        <title>Prima</title>
      </Head>

      <Pane display="flex" flexDirection="column" height="100vh" background={S.props(["colors", "background", "purpleTint"])(primaTheme)}>

        {!hideHeader && <Header user={ user } loading={ loading } />}

        {/* Api Errors */}
        {/* {error && <Pane margin={majorScale(2)}>
          <Alert
            intent="danger"
            title="Ops. Algo está errado. Nossos engenheiros já foram informados. Tente novamente mais tarde. Obrigado."
          />
        </Pane>} */}

        {children}

      </Pane>

      
      {/* <main>
        <div className="container">{children}</div>
      </main> */}

      <style jsx>{`
        .container {
          max-width: 42rem;
          margin: 1.5rem auto;
        }
      `}</style>
      <style jsx global>{`
        body {
          margin: 0;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
    </>
  )
}

export default Layout