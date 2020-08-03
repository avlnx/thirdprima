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

const sources = [
    S.Pair("1")("JRG Alimentos"),
    S.Pair("2")("JTC Distribuidora"),
    S.Pair("3")("R Moura"),
    S.Pair("4")("Elmar"),
]

const ProductList = ({ viewingCart, loading, products }) => {
    const safeProducts = S.get (S.is ($.Array ($.Object))) ("results") (products)
    
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
                            <ProductRow quantity={2} viewingCart={viewingCart} product={product} key={S.prop("url")(product)} sources={sources} />)) (S.fromMaybe ([]) (safeProducts)))}
                </Table.Body>
            </Table>
        </Card>
    )
}

export default ProductList

export const getStaticProps = async () => {
    const res = await fetch(`http://localhost:9000/api/sources/`)
    const sources = await res.json()

    console.log ("sources", sources)

    return {
        props: {
            sources
        }
    }
}