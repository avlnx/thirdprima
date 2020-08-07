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
import Variant from "./variant"
import "isomorphic-unfetch"
import { findByIdInList, id } from "../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const ProductRow = ({ product, sources, viewingCart, quantity, userId }) => {
    // // Array of objects predicate
    const arrayOfObjects = S.is($.Array($.Object))

    const variants = S.get(arrayOfObjects)("variants")(product)
    const flatVariants = S.fromMaybe([])(variants)

    const mbFirstVariantsId = S.pipe([
        S.chain(S.head),
        S.chain(S.get(S.is($.String))("_id"))
    ])(variants)
    
    const mbSelectedVariantId = S.maybeToNullable(mbFirstVariantsId)
    
    const [selectedVariant, setSelectedVariant] = useState(mbSelectedVariantId)
    
    const mbVariantObject = findByIdInList(selectedVariant)(flatVariants)
    const selected = S.fromMaybe ({}) (mbVariantObject)

    const mbSourceId = S.map(S.prop("source"))(mbVariantObject)

    const mbSource = findByIdInList(S.fromMaybe("não encontrado")(mbSourceId))(sources)   // if -1 is Nothing

    const nextCartState = async (delta) => {
        const res = await fetch("http://localhost:3000/api/cart", {
            method: "post",
            body: JSON.stringify({
                delta: delta,
                variantId: `${selectedVariant}`,
                productId: `${id(product)}`,
                owner: userId,
            })
        })
        console.log("nextCart", res)
    }

    // short-circuit if no valid variant is found
    return (S.or(S.isNothing(mbSource))(S.isNothing(mbVariantObject)))
        ? (<Alert
            intent="danger"
            title="Aqui jaz um produto malcriado."
        />)
        : (
            <Table.Row display="flex" key={id(product)} height="auto" padding={majorScale(1)} flexWrap="wrap" backgroundColor={"white"}>

                {viewingCart && <Table.TextCell flexBasis={60} flexGrow={0} flexShrink={0}>
                    <Badge color="red">{quantity}</Badge>
                </Table.TextCell>}

                <Table.TextCell flexBasis={380} paddingY={majorScale(1)}>
                    <Heading size={500} whiteSpace="normal">{S.prop("label")(product)}</Heading>
                </Table.TextCell>
                <Table.TextCell display="flex" flexBasis={380} paddingY={majorScale(1)}>
                    {!viewingCart ? (
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
                                            <Table.Row key={id(v)} isSelectable onSelect={() => {
                                                close()
                                                setSelectedVariant(id(v))
                                            }}>
                                                <Variant variant={v} sources={sources} />
                                            </Table.Row>
                                        )(flatVariants)}
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
                        <Button flex={"1"} appearance="minimal" onClick={() => nextCartState(-Infinity)}
                            intent="danger">remover</Button>
                        <IconButton flex={"1"} onClick={() => nextCartState(-1)} icon={MinusIcon} />
                        <IconButton flex={"1"} onClick={() => nextCartState(1)} icon={PlusIcon} />
                    </Pane>
                </Table.TextCell>
            </Table.Row>
        )
}

export default ProductRow
