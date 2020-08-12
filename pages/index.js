import Layout from '../components/layout'
import { getProducts, getSources, getCart } from "../lib/prima"
import connect from "../lib/db"

function Home({ products, sources, cart: apiCart }) {
  // const clearCart = () => {
  //   const nextCart = { ...apiCart, total: 0, items: {} }
  //   setCart(nextCart)
  //   postNextCartState(nextCart)
  // }

  return (<Layout inCart={false} products={products} cart={apiCart.cart} sources={sources} />)
}

export default Home

export async function getServerSideProps({ req, res }) {
  const db = await connect()

  const products = JSON.parse(await getProducts(db))

  const sources = JSON.parse(await getSources(db))

  const cart = JSON.parse(await getCart(db))

  return {
    props: {
      products,
      sources,
      cart,
    }
  }
}

