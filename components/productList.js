import {
  Card,
  majorScale,
  Table,
} from "evergreen-ui"
import ProductRow from "./productRow"
import { id } from "../lib/prima"

const S = require("sanctuary")

const ProductList = ({ viewingCart, products, sources, updateProductQuantityBy, user }) => {

  return (
    <>

      <Card elevation={2} margin={majorScale(2)} padding={0} flex="1" overflowY="auto" background="white">
        <Table>
          <Table.Body>
            {S.unchecked.map(product => (
              <ProductRow updateProductQuantityBy={updateProductQuantityBy} userId={S.prop("email")(user)} viewingCart={viewingCart} product={product} key={id(product)} sources={sources} />))(products)}
          </Table.Body>
        </Table>
      </Card>

      {/* <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} totalResults={S.fromMaybe(0)(dataCount)} /> */}
    </>
  )
}

export default ProductList
