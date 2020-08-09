import React, { useState, useEffect } from "react"
import {
  Alert,
  Badge,
  Button,
  CaretDownIcon,
  IconButton,
  Heading,
  minorScale,
  majorScale,
  MinusIcon,
  PlusIcon,
  Pane,
  Popover,
  Table,
} from 'evergreen-ui'
import Variant from "./variant"
import ActionButtons from "./actionButtons"
import "isomorphic-unfetch"

import { arrayOfObjects, id, indexById, stringProp } from "../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const ProductRow = ({ product, viewingCart, userId }) => {

  const [selectedVariantId, setSelectedVariantId] = useState("")

  const productId = stringProp("_id")(product)

  const variants = S.get(arrayOfObjects)("variants")(product)
  const flatVariants = S.maybeToNullable(variants)

  const label = stringProp("label")(product)

  const data = [productId, variants, label]

  const invalidRender = <Alert intent="warning" title="Este produto não está se comportando." />
  // bail if no variants
  if (S.unchecked.any(S.isNothing)(data)) return invalidRender

  const indexedVariants = indexById(S.maybeToNullable(variants))

  const mbFirstVariantsId = S.pipe([
    S.chain(S.head),
    S.chain(S.get(S.is($.String))("_id"))
  ])(variants)

  const firstVariantsId = S.maybeToNullable(mbFirstVariantsId)

  if (firstVariantsId === null) {
    console.log(`bailing because of variant ${S.show(firstVariantsId)} with maybe ${S.show(mbFirstVariantsId)}`)
    return <Alert intent="warning" title="Este produto não tem variações aparentemente :(" />
  }

  useEffect(() => {
    // runs once, pick the first variant as default
    setSelectedVariantId(firstVariantsId)
  }, [])

  const selected = S.maybeToNullable (S.get (_ => true) (selectedVariantId) (indexedVariants))

  const nextCartState = async (delta) => {
    // setQuantity(S.max(0)(quantity + delta))
    const res = await fetch("http://localhost:3000/api/cart", {
      method: "post",
      body: JSON.stringify({
        delta: delta,
        variantId: `${selectedVariantId}`,
        productId: `${S.maybeToNullable (productId)}`,
        owner: userId,
      })
    })
    console.log("nextCart", res)
  }

  return (
    <Table.Row display="flex" key={productId} height="auto" padding={minorScale(1)} flexWrap="wrap" backgroundColor={"white"}>

      {/* {viewingCart && <Table.TextCell flexBasis={60} flexGrow={0} flexShrink={0}>
                <Badge color="red">{quantity}</Badge>
            </Table.TextCell>} */}

      <Table.TextCell flexBasis={380} paddingY={majorScale(1)}>
        <Heading size={500} whiteSpace="normal">{S.maybeToNullable(stringProp("label")(product))}</Heading>
      </Table.TextCell>
      <Table.TextCell display="flex" flexBasis={380} paddingY={majorScale(1)}>
        {!viewingCart
          ? <Popover content={({ close }) => (
            <Table>
              <Table.Head>
                <Table.TextCell>Escolha o melhor</Table.TextCell>
              </Table.Head>
              <Table.Body>
                {S.map(v => <Table.Row key={id(v)} isSelected={S.equals (S.prop ("_id") (v)) (selectedVariantId)} isSelectable onSelect={() => {
                  close()
                  setSelectedVariantId(id(v))
                }}>
                  <Variant variant={v} />
                </Table.Row>)(flatVariants)}
              </Table.Body>
            </Table>)}>
            <Button iconAfter={CaretDownIcon}>
              <Variant variant={selected} />
            </Button>
          </Popover>
          : <Variant variant={selected} />
        }
      </Table.TextCell>
      <Table.TextCell flexBasis={150} paddingY={majorScale(1)}>
        <ActionButtons action={nextCartState} />
        {/* <Pane
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between">
                    <Button flex={"1"} appearance="minimal" onClick={() => nextCartState(-Infinity)}
                        intent="danger">remover</Button>
                    <IconButton flex={"1"} onClick={() => nextCartState(-1)} icon={MinusIcon} />
                    <IconButton flex={"1"} onClick={() => nextCartState(1)} icon={PlusIcon} />
                </Pane> */}
      </Table.TextCell>
    </Table.Row>
  )
}

export default ProductRow
