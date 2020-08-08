import Head from 'next/head'
import Header from './header'
import { useState } from "react"
import { useFetchUser } from '../lib/user'
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
import LoginBox from "./loginBox"

// import { useAuth0 } from "@auth0/auth0-react";

const S = require('sanctuary')
const $ = require ("sanctuary-def")

const Layout = ({ products, children, loading: upperLoading }) => {
  const { user, loading } = useFetchUser();

  const isLoading = loading || upperLoading

  const [currentPage, setCurrentPage] = useState(1) // start at page 1

  const mbUser = S.get (S.is ($.String)) ("sub") (user)

  const isAuthenticated = S.maybeToNullable (mbUser) !== null

  const hideHeader = !isAuthenticated

  return (
    <>
      <Head>
        <title>Prima</title>
      </Head>

      <Pane display="flex" flexDirection="column" height="100vh" background={S.props(["colors", "background", "purpleTint"])(primaTheme)}>
        
        {isLoading 
          ? <Spinner />
          : !isAuthenticated && <LoginBox /> || isAuthenticated && children
        }
        
        {!hideHeader && <Header user={user} loading={isLoading} />}
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