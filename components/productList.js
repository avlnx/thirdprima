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
import { primaTheme } from "../theme"

const S = require ("sanctuary")
const $ = require ("sanctuary-def")

const ProductList = ({ viewingCart, loading, products, sources }) => {
    
    return (
        <Card elevation={1} margin={majorScale(2)} padding={0} flex="1" overflowY="auto" background="white">
            <Table>
                <Table.Head style={viewingCart ? { "background": "#1070CA" } : undefined} >
                    {!viewingCart
                        ? (<Table.SearchHeaderCell placeholder="Busque por nome" onChange={(v) => setQuery(v)} />)
                        : (<Table.TextHeaderCell >
                            <ShoppingCartIcon size={20} color="white" />
                            <Text size={300} marginLeft={majorScale(1)} textTransform="uppercase" color={S.props(["palette", "blue", "lightest"])(primaTheme)}>Visualizando o carrinho</Text>
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
    )
}

export default ProductList
