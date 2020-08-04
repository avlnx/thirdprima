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

    const id = S.prop ("id")

    // // Array of objects predicate
    const arrayOfObjects = S.is ($.Array ($.Object))

    // const flatVariants = S.join(variantsGroupedByPack)
    const variants = S.get (arrayOfObjects) ("variants") (product)
    const flatVariants = S.fromMaybe ([]) (variants)

    // variantsUrl :: Object -> Maybe String
    const getId = S.get (S.is ($.String)) ("id")

    const firstVariantsId = S.get (_ => true) ("id") (S.fromMaybe ({}) (S.head (flatVariants)))

    const [ selectedVariant, setSelectedVariant ] = useState(S.maybeToNullable (firstVariantsId))

    // const getFlatVariantWithIdFromList = id => S.pipe ([
    //     getVariantWithIdFromList (id),
    //     S.maybeToNullable    // we get a from nullable here because we want this to explode, it shouldnt happen. if we let it slide it gets hard to track down the line. this means we should strategecally fail.
    // ])

    // getVariantWithIdFromList :: String -> Array (Object) -> Maybe (Object)
    const getVariantWithIdFromList = variantId => S.find (v => S.equals (id (v))(variantId))

    const selected = S.fromMaybe ({}) (getVariantWithIdFromList (selectedVariant) (flatVariants))

    // const source = S.get (S.is ($.String)) ("source") (selected)

    const source = S.map (S.prop ("source")) (S.Just (selected))

    return (
        <Table.Row display="flex" key={id (product)} height="auto" padding={majorScale(1)} flexWrap="wrap" backgroundColor={viewingCart ? S.props(["palette", "blue", "lightest"])(primaTheme) : "white"}>

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
                        title="Ops. Algo está errado com este produto mate."
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
                                            <Table.Row key={id (v)} isSelectable onSelect={() => {
                                                close()
                                                setSelectedVariant(id (v))
                                            }}>
                                                <Variant variant={v} sources={sources} />
                                            </Table.Row>
                                        ) (flatVariants)}
                                    </Table.Body>
                                </Table>
                            )}>
                            <Button iconAfter={CaretDownIcon}>
                                <Variant variant={selected} sources={sources} />
                            </Button>
                        </Popover>)
                        : (<Variant variant={selected} sources={sources} />)
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
