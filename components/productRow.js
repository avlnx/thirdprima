import React, { useState } from "react"
import {
    Alert,
    Badge,
    Button,
    CaretDownIcon,
    IconButton,
    Heading,
    majorScale,
    MinusIcon,
    PlusIcon,
    Pane,
    Popover,
    Table,
} from 'evergreen-ui'
import { primaTheme } from "../theme"
import Variant from "./variant"

const S = require("sanctuary")
const $ = require("sanctuary-def")

export const lastItemInUrl = S.pipe([
    S.splitOn("/"),
    S.dropLast(1),
    S.chain(S.last),
    S.fromMaybe("erro"),
])


const ProductRow = ({ product, sources, viewingCart, quantity }) => {

    // // Array of objects predicate
    const arrayOfObjects = S.is ($.Array ($.Object))

    // const flatVariants = S.join(variantsGroupedByPack)
    const variants = S.get (arrayOfObjects) ("variants") (product)
    const flatVariants = S.fromMaybe ([]) (variants)

    // variantsUrl :: Object -> Maybe String
    const variantsId = S.get (S.is ($.String)) ("id")

    // generalized above to maybeProp :)
    // const maybeProp = S.get (_ => true)

    const firstVariantsId = S.pipe([
        S.head,
        S.chain (variantsId),
    ])

    const [selectedVariant, setSelectedVariant] = useState (S.fromMaybe ("ERRO: Produto sem nenhuma variaćão. Ignore por favor.") (firstVariantsId(flatVariants)))

    // :: String -> Maybe Object
    const getVariantWithIdFromList = id => S.pipe ([
        S.filter (v => S.equals (S.Just (id)) (variantsId (v))),
        S.head,
    ])

    const getFlatVariantWithIdFromList = id => S.pipe ([
        getVariantWithIdFromList (id),
        S.fromMaybe ({})
    ])

    const loadFlatSelectedVariantObject = id => getFlatVariantWithIdFromList (id) (flatVariants)

    const selectedVariantObject = loadFlatSelectedVariantObject (selectedVariant)

    // findSourceNameById :: String -> String
    // const findSourceNameById = id => S.snd (S.fromMaybe (S.Pair ("erro") ("não encontrado")) (findSourceById (id) (sources)))

    // const findSourceNameFromVariant = v => findSourceNameById (lastItemInUrl (S.prop ("source") (v)))

    const source = S.get (S.is ($.String)) ("source") (selectedVariantObject)

    return (
        <Table.Row display="flex" key={S.prop("id")(product)} height="auto" padding={majorScale(1)} flexWrap="wrap" backgroundColor={viewingCart ? S.props(["palette", "blue", "lightest"])(primaTheme) : "white"}>

            {viewingCart && <Table.TextCell flexBasis={60} flexGrow={0} flexShrink={0}>
                <Badge color="red">{quantity}</Badge>
            </Table.TextCell>}

            <Table.TextCell flexBasis={380} paddingY={majorScale(1)}>
                <Heading size={500} whiteSpace="normal">{S.prop("label")(product)}</Heading>
            </Table.TextCell>
            <Table.TextCell display="flex" flexBasis={380} paddingY={majorScale(1)}>
                {S.isNothing(source) && false 
                    ? (<Alert
                        intent="danger"
                        title="Ops. Algo está errado com este produto."
                    />)
                    : !viewingCart ? (
                        <Popover
                            content={({ close }) => (
                                <Table>
                                    <Table.Head>
                                        <Table.TextCell>
                                            Escolha o melhor
                          </Table.TextCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {S.map (v =>
                                            <Table.Row key={S.prop("id")(v)} isSelectable onSelect={() => {
                                                close()
                                                setSelectedVariant(S.prop("id")(v))
                                            }}>
                                                <Variant variant={v} sources={sources} />
                                            </Table.Row>
                                        ) (flatVariants)}
                                    </Table.Body>
                                </Table>
                            )}>
                            <Button iconAfter={CaretDownIcon}>
                                <Variant variant={selectedVariantObject} sources={sources} />
                            </Button>
                        </Popover>)
                        : (<Variant variant={selectedVariantObject} sources={sources} />)
                }
            </Table.TextCell>
            <Table.TextCell flexBasis={150} paddingY={majorScale(1)}>
                <Pane
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between">
                    <Button flex={"1"} appearance="minimal" intent="danger">remover</Button>
                    <IconButton flex={"1"} icon={MinusIcon} />
                    <IconButton flex={"1"} icon={PlusIcon} />
                </Pane>
            </Table.TextCell>
        </Table.Row>
    )
}

export default ProductRow
