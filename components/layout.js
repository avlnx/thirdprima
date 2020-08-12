import Head from 'next/head'
import Header from './header'
import { useState } from "react"
import { useFetchUser } from '../lib/user'
import ProductList from "../components/productList"
import Paginator from "../components/paginator"
import Totalizer from "../components/totalizer"
import LoginBox from "../components/loginBox"
import { currency, updateProductQuantityBy, numberPropOrZero, makeCartMutation, postNextCartState, getNextCart, getProducts, getSources, getCart, CartContext, indexById, CARTSTATUS } from "../lib/prima"
import { primaTheme, brand } from "../theme"
import {
  Card,
  Heading,
  minorScale,
  majorScale,
  Pane,
  ShoppingCartIcon,
  Spinner,
} from 'evergreen-ui'
import SpinnerBox from "./spinnerBox"
import SearchBox from "./searchBox"

const S = require('sanctuary')
const $ = require ("sanctuary-def")


const Layout = ({ products, cart: apiCart, sources, children, inCart }) => {
  const [cart, setCart] = useState(apiCart)
  const { user, loading } = useFetchUser();
  
  const mbUser = S.get (S.is ($.String)) ("sub") (user)
  
  const isAuthenticated = S.maybeToNullable (mbUser) !== null
  
  const hideHeader = !isAuthenticated
  
  const indexedSources = indexById(sources)
  
  const total = S.get(S.is($.FiniteNumber))("total")(cart)
  
  const cartItemsCount = S.pipe([
    S.prop("items"),
    S.values,
    S.chain(S.values),
    S.sum,
  ])(cart)

  const clearCart = () => {
    const nextCart = S.unchecked.remove ("_id") ({ ...apiCart, total: 0, items: {} })
    setCart(nextCart)
    postNextCartState(nextCart)
  }
  
  const boundClearCart = clearCart.bind()
  
  const userId = S.maybeToNullable(S.get(S.is($.String))("sub")(user))
  
  const updateQuantityAndSetState = (productId, variantId, delta, subtotal) => {
    // calculate locally too
    const mutation = makeCartMutation(productId)(variantId)(delta)(userId)(subtotal)(CARTSTATUS.auto)
    const nextCart = getNextCart(cart)(mutation)
    // set off post but don't wait for the response. The state will be updated automatically but for a more snappy experience we return this nextCart and update it on the client too. The server will revalidate when the response comes. TODO: error handling
    postNextCartState(nextCart)
    setCart(nextCart)
  }
  
  const boundUpdateQuantity = updateQuantityAndSetState.bind()
  const lightPrimary = S.props (["palette", "purple", "light"]) (primaTheme)
  
  return (
    <>
      <Head>
        <title>Prima</title>
      </Head>

      <Pane display="flex" flexDirection="column" height="100vh" background={S.props(["palette", "purple", "lightest"])(primaTheme)}>
        
        {loading 
          ? <SpinnerBox />
          : (!isAuthenticated && <LoginBox />) 
          || (isAuthenticated && 
            <CartContext.Provider value={cart}>
              <SearchBox />
              {inCart && <Card elevation={1} background={brand} margin={majorScale(2)} marginBottom={minorScale(1)} padding={minorScale(1)} display="flex" alignItems="center" justifyContent="flex-start">
                <ShoppingCartIcon color={lightPrimary} />
                <Heading size={200} padding={minorScale(1)} marginLeft={minorScale(2)} color={lightPrimary}>Seu carrinho</Heading>
              </Card>}
              <ProductList updateProductQuantityBy={boundUpdateQuantity} products={products} sources={indexedSources} />
              
              <Totalizer inCart={inCart} total={S.fromMaybe("R$ 0")(S.map(currency.format)(total))} count={cartItemsCount} clearCart={boundClearCart} />
              {!hideHeader && <Header user={user} loading={loading} />}
            </CartContext.Provider>)
        }
        
        
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