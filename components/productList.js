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

const ProductList = ({ viewingCart, products, sources, updateProductQuantityBy, cart }) => {

    const { user, loading } = useFetchUser()
    // debugger
    const productList = products
    
    return (
        <>
        <SearchBox />
            <Card elevation={1} margin={majorScale(2)} padding={0} flex="1" overflowY="auto" background="white">
                <Table>
                    <Table.Head style={viewingCart ? { "background": brand } : undefined} >
                        {viewingCart && (<Table.TextHeaderCell >
                                <Text size={300} textTransform="uppercase" color={S.props(["palette", "blue", "lightest"])(primaTheme)}>Seu carrinho</Text>
                                <ShoppingCartIcon size={16} color="white" marginLeft={ majorScale (1) } />
                            </Table.TextHeaderCell>
                            )}
                    </Table.Head>
                    <Table.Body>
                        {loading ? (
                            <Pane display="flex" alignItems="center" justifyContent="center" height={"50vh"}>
                                <Spinner />
                            </Pane>)
                            : (S.unchecked.map (product => (
                                <ProductRow cart={cart} updateProductQuantityBy={updateProductQuantityBy} userId={ S.prop ("sub") (user) } viewingCart={viewingCart} product={product} key={id (product)} sources={sources} />)) (productList))}
                    </Table.Body>
                </Table>
            </Card>

            {/* <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} totalResults={S.fromMaybe(0)(dataCount)} /> */}
        </>
    )
}

export default ProductList
