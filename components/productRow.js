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

const S = require("sanctuary")
const $ = require("sanctuary-def")

export const lastItemInUrl = S.pipe([
    S.splitOn("/"),
    S.dropLast(1),
    S.chain(S.last),
    S.fromMaybe("erro"),
])

const ProductRow = ({ product, sources, viewingCart, quantity, userId }) => {

    const id = S.prop ("id")

    // // Array of objects predicate
    const arrayOfObjects = S.is ($.Array ($.Object))

    // const flatVariants = S.join(variantsGroupedByPack)
    const variants = S.get (arrayOfObjects) ("variants") (product)
    const flatVariants = S.fromMaybe ([]) (variants)

    const firstVariantsId = S.get (_ => true) ("id") (S.fromMaybe ({}) (S.head (flatVariants)))

    const [ selectedVariant, setSelectedVariant ] = useState(S.maybeToNullable (firstVariantsId))

    // getVariantWithIdFromList :: String -> Array (Object) -> Maybe (Object)
    const getVariantWithIdFromList = variantId => S.find (v => S.equals (id (v))(variantId))

    const selected = S.fromMaybe ({}) (getVariantWithIdFromList (selectedVariant) (flatVariants))

    const source = S.map (S.prop ("source")) (S.Just (selected))

    const nextCartState = async (delta) => {
        const res = await fetch("http://localhost:3000/api/cart", {
            method: "post",
            body: JSON.stringify ({
                delta: delta,
                variantId: `${selectedVariant}`,
                owner: userId,
            })
        })
        console.log("nextCart", res)
    }

    return (
        <Table.Row display="flex" key={id (product)} height="auto" padding={majorScale(1)} flexWrap="wrap" backgroundColor={"white"}>

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
                    <Button flex={"1"} appearance="minimal" onClick={() => nextCartState (-Infinity) } 
                    intent="danger">remover</Button>
                    <IconButton flex={"1"} onClick={ () => nextCartState (-1) } icon={MinusIcon} />
                    <IconButton flex={"1"} onClick={ () => nextCartState (1) }  icon={PlusIcon} />
                </Pane>
            </Table.TextCell>
        </Table.Row>
    )
}

export default ProductRow
