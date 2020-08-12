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
import { useFetchUser } from '../lib/user'
import { id } from "../lib/prima"
import Link from 'next/link'

const S = require ("sanctuary")
const $ = require ("sanctuary-def")

const ProductList = ({ viewingCart, products, sources, updateProductQuantityBy }) => {

    const { user, loading } = useFetchUser()
    // debugger
    const productList = products
    
    return (
        <>
        
            <Card elevation={2} margin={majorScale(2)} padding={0} flex="1" overflowY="auto" background="white">
                <Table>
                    
                    <Table.Body>
                        {loading ? (
                            <Pane display="flex" alignItems="center" justifyContent="center" height={"50vh"}>
                                <Spinner />
                            </Pane>)
                            : (S.unchecked.map (product => (
                                <ProductRow updateProductQuantityBy={updateProductQuantityBy} userId={ S.prop ("sub") (user) } viewingCart={viewingCart} product={product} key={id (product)} sources={sources} />)) (productList))}
                    </Table.Body>
                </Table>
            </Card>

            {/* <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} totalResults={S.fromMaybe(0)(dataCount)} /> */}
        </>
    )
}

export default ProductList
