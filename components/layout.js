import Head from "next/head"
import Header from "./header"
import { useState } from "react"
import ProductList from "../components/productList"
import Totalizer from "../components/totalizer"
import LoginBox from "../components/loginBox"
import { currency, makeCartMutation, postNextCartState, getNextCart, CartContext, indexById, CARTSTATUS } from "../lib/prima"
import { primaTheme } from "../theme"
import { useRouter } from "next/router"
import {
  majorScale,
  Alert,
  Pane,
  toaster,
} from "evergreen-ui"
import SpinnerBox from "./spinnerBox"
import SearchBox from "./searchBox"
import { signIn, signOut, useSession } from "next-auth/client"

const S = require("sanctuary")
const $ = require ("sanctuary-def")

const Layout = ({ products, cart: apiCart, sources, children, inIndex, inCart, inSearch, searchQuery, pageDescription, msg }) => {
  const [cart, setCart] = useState(apiCart)
  const [session, loading] = useSession()
  const [ message, setMessage ] = useState(msg)
  const router = useRouter()
  const mbUser = S.get (S.is ($.Object)) ("user") (session)
  const user = S.fromMaybe ({}) (mbUser)
  const indexedSources = indexById(sources)
  const total = S.get(S.is($.FiniteNumber))("total")(cart)

  const cartItemsCount = S.pipe([
    S.prop("items"),
    S.values,
    S.chain(S.values),
    S.sum,
  ])(cart)

  const goToIndex = (msg) => {
    router.push({
      pathname: "/",
      query: { msg },
    })
  }

  const clearCart = () => {
    const nextCart = S.unchecked.remove ("_id") ({ ...apiCart, total: 0, items: {} })
    postNextCartState(nextCart)
    setCart(nextCart)
  }

  const flashMsg = msg => {
    toaster.notify(msg)
  }

  const promoteCartToPurchase = async () => {
    const nextCart = S.unchecked.remove("products") (S.unchecked.remove ("_id") ({ ...apiCart, status: CARTSTATUS.purchasePending, user: user }))
    const result = await postNextCartState(nextCart)
    const msg = S.maybeToEither (result => S.prop ("error") (result)) (S.value ("success") (result))
    S.either (flashMsg) (goToIndex) (msg)
  }
  const boundPromoteCartToPurchase = promoteCartToPurchase.bind()
  
  const boundClearCart = clearCart.bind()
  
  const userId = S.maybeToNullable(S.get(S.is($.String))("email")(user))
  
  const updateQuantityAndSetState = (productId, variantId, delta, subtotal) => {
    // calculate locally too
    const mutation = makeCartMutation(productId)(variantId)(delta)(userId)(subtotal)(CARTSTATUS.auto)
    const nextCart = getNextCart(cart)(mutation)
    // set off post but don't wait for the response. The state will be updated automatically but for a more snappy experience we return this nextCart and update it on the client too. The server will revalidate when the response comes. TODO: error handling
    postNextCartState(nextCart)
    setCart(nextCart)
  }
  
  const boundUpdateQuantity = updateQuantityAndSetState.bind()
  
  return (
    <>
      <Head>
        <title>Prima</title>
      </Head>

      <Pane display="flex" flexDirection="column" height="100vh" background={S.props(["palette", "purple", "lightest"])(primaTheme)}>
        
        {loading 
          ? <SpinnerBox />
          : (!session && <LoginBox />) 
          || (session && 
            <CartContext.Provider value={cart}>
              <SearchBox />
              
              { !message && pageDescription }

              { message && <Alert marginX={majorScale (2)} intent="warning" title={message} />}

              <ProductList updateProductQuantityBy={boundUpdateQuantity} products={products} sources={indexedSources} user={user} />
              
              <Totalizer inCart={inCart} total={S.fromMaybe("R$ 0")(S.map(currency.format)(total))} count={cartItemsCount} clearCart={boundClearCart} promoteCartToPurchase={boundPromoteCartToPurchase} />
              <Header user={user} loading={loading} />
            </CartContext.Provider>)
        }
      </Pane>
    </>
  )
}

export default Layout