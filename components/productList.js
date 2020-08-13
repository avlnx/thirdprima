import {
  Button,
  Card,
  majorScale,
  Pane,
  Table,
  Text,
  ShoppingCartIcon,
  Spinner,
} from "evergreen-ui"
import ProductRow from "./productRow"
import SearchBox from "./searchBox"
import { primaTheme, brand } from "../theme"
import { useSession } from "next-auth/client"
import { id } from "../lib/prima"
import Link from "next/link"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const ProductList = ({ viewingCart, products, sources, updateProductQuantityBy, user }) => {
  // debugger
  const productList = products
  const [session, loading] = useSession()
  //   const mbUser = S.get(S.is($.Object))("user")(session)
  //   const isAuthenticated = S.isJust(mbUser)
  //   const user = S.fromMaybe({})(mbUser)

  return (
    <>

      <Card elevation={2} margin={majorScale(2)} padding={0} flex="1" overflowY="auto" background="white">
        <Table>

          <Table.Body>
            {loading ? (
              <Pane display="flex" alignItems="center" justifyContent="center" height={"50vh"}>
                <Spinner />
              </Pane>)
              : (S.unchecked.map(product => (
                <ProductRow updateProductQuantityBy={updateProductQuantityBy} userId={S.prop("email")(user)} viewingCart={viewingCart} product={product} key={id(product)} sources={sources} />))(productList))}
          </Table.Body>
        </Table>
      </Card>

      {/* <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} totalResults={S.fromMaybe(0)(dataCount)} /> */}
    </>
  )
}

export default ProductList
