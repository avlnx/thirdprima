import Layout from '../components/layout'
import { getSources, getFullCart } from "../lib/prima"
import connect from "../lib/db"

function Cart({ sources, cart: apiCart }) {
  return (<Layout clearCart={clearCart} products={apiCart.cart.products} sources={sources} inCart={true} />)
}

export default Cart

export async function getServerSideProps({ req, res }) {
  const db = await connect()

  const sources = JSON.parse(await getSources(db))

  const cart = JSON.parse(await getFullCart(db))

  return {
    props: {
      sources,
      cart,
    }
  }
}

