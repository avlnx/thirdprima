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

const S = require ("sanctuary")
const $ = require ("sanctuary-def")

export const lastItemInUrl = S.pipe([
    S.splitOn("/"),
    S.dropLast(1),
    S.chain(S.last),
    S.fromMaybe("erro"),
])

// findSourceById :: String -> Maybe Pair
const findSourceById = id => S.find(source => S.equals (id) (S.fst (source)))

export const findSourceNameById = id => sources => S.snd (S.fromMaybe (S.Pair("erro") ("não encontrado")) (findSourceById (id) (sources)))

// const filterDuplicates = xs => [...new Set(xs)]

const ProductRow = ({ product, sources, viewingCart, quantity }) => {

    // // Array of objects predicate
    const arrayOfObjects = S.is($.Array($.Object))

    // // Either a list of variant objects or Nothing
    const variants = S.fromMaybe([])(S.get(arrayOfObjects)("variants")(product))

    const variantsGroupedByPack = S.groupBy(x => y => S.equals(S.prop("pack_label")(x))(S.prop("pack_label")(y)))(variants)

    const flatVariants = S.join(variantsGroupedByPack)

    // variantsUrl :: Object -> Maybe String
    const variantsUrl = S.get(S.is($.String))("url")

    // generalized above to maybeProp :)
    // const maybeProp = S.get (_ => true)

    const firstVariantsUrl = S.pipe([
        S.head,
        S.chain(variantsUrl),
    ])

    const [selectedVariant, setSelectedVariant] = useState(S.fromMaybe("ERRO: Produto sem nenhuma variaćão. Ignore por favor.")(firstVariantsUrl(flatVariants)))

    // :: String -> Maybe Object
    const getVariantWithUrlFromList = url => S.pipe([
        S.filter(v => S.equals(S.Just(url))(variantsUrl(v))),
        S.head,
    ])

    const getFlatVariantWithUrlFromList = url => S.pipe([
        getVariantWithUrlFromList(url),
        S.fromMaybe({})
    ])

    const loadFlatSelectedVariantObject = url => getFlatVariantWithUrlFromList(url)(flatVariants)

    const selectedVariantObject = loadFlatSelectedVariantObject(selectedVariant)

    // findSourceNameById :: String -> String
    // const findSourceNameById = id => S.snd (S.fromMaybe (S.Pair ("erro") ("não encontrado")) (findSourceById (id) (sources)))

    // const findSourceNameFromVariant = v => findSourceNameById (lastItemInUrl (S.prop ("source") (v)))

    const source = S.get(S.is($.String))("source")(selectedVariantObject)

    return (
        <Table.Row display="flex" key={S.prop("url")(product)} height="auto" padding={majorScale(1)} flexWrap="wrap" backgroundColor={viewingCart ? S.props(["palette", "blue", "lightest"])(primaTheme) : "white"}>

            {viewingCart && <Table.TextCell flexBasis={60} flexGrow={0} flexShrink={0}>
                <Badge color="red">{quantity}</Badge>
            </Table.TextCell>}

            <Table.TextCell flexBasis={380} paddingY={majorScale(1)}>
                <Heading size={500} whiteSpace="normal">{S.prop("label")(product)}</Heading>
            </Table.TextCell>
            <Table.TextCell display="flex" flexBasis={380} paddingY={majorScale(1)}>
                {S.isNothing(source)
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
                                        {S.map(v =>
                                            <Table.Row key={S.prop("url")(v)} isSelectable onSelect={() => {
                                                close()
                                                setSelectedVariant(S.prop("url")(v))
                                            }}>
                                                <Variant variant={v} sources={sources} />
                                            </Table.Row>
                                        )(flatVariants)}
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
