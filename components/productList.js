import {
    Card,
    majorScale,
    Pane,
    Table,
    Text,
    ShoppingCartIcon,
    Spinner,
} from "evergreen-ui"
import ProductRow from "./productRow.js"
import { primaTheme, brand } from "../theme"

const S = require ("sanctuary")
const $ = require ("sanctuary-def")

const ProductList = ({ viewingCart, loading, products, sources }) => {
    
    return (
        <>
            <Card elevation={1} margin={majorScale(2)} padding={0} flex="1" overflowY="auto" background="white">
                <Table>
                    <Table.Head style={viewingCart ? { "background": brand } : undefined} >
                        {!viewingCart
                            ? (<Table.SearchHeaderCell placeholder="Busque por nome" onChange={(v) => setQuery(v)} />)
                            : (<Table.TextHeaderCell >
                                
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
                                <ProductRow quantity={2} viewingCart={viewingCart} product={product} key={S.prop("id")(product)} sources={sources} />)) (products))}
                    </Table.Body>
                </Table>
            </Card>

            {/* <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} totalResults={S.fromMaybe(0)(dataCount)} /> */}
        </>
    )
}

export default ProductList
