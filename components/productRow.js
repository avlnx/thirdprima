import React, { useState } from "react"
import {
  Alert,
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
} from "evergreen-ui"
import Variant from "./variant"

import { arrayOfObjects, id, indexById, stringProp, getCartQuantity, CartContext, findByIdInList } from "../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const ProductRow = ({ product, viewingCart, updateProductQuantityBy, sources }) => {
  const productId = stringProp("_id")(product)
  
  const variants = S.get(arrayOfObjects)("variants")(product)
  const isValidVariant = variant => {
    // debugger
    const sourceId = S.get(S.is($.String))("source")(variant)
    const productId = S.get(S.is($.String))("product")(variant)
    const variantId = S.get(S.is($.String))("_id")(variant)
    const packLabel = S.get(S.is($.String))("pack_label")(variant)
    const packUnit = S.get(S.is($.String))("pack_unit")(variant)
    // TODO: pick price based on user preference (simples, deferred)
    const price = S.get(S.is($.NonZeroValidNumber))("price")(variant)
    // const { source, product, _id, pack_label, pack_unit, price } = variant
    const source = findByIdInList(S.fromMaybe("")(sourceId))(sources)
    const data = [sourceId, productId, variantId, packLabel, packUnit, price, source]
    
    const result = S.unchecked.all(S.isJust)(data)
    return result
  }
  const validVariants = S.unchecked.filter(isValidVariant)(S.fromMaybe([]) (variants))

  const sortedVariants = S.sortBy (S.prop ("price")) (validVariants)
  
  const label = stringProp("label")(product)
  
  const data = [productId, variants, label]
  
  const invalidRender = <Alert intent="warning" title="Este produto não está se comportando." />
  // bail if no variants
  if (S.unchecked.any(S.isNothing)(data)) return invalidRender
  
  const productIdValue = S.maybeToNullable(productId)
  
  const indexedVariants = indexById(sortedVariants)
  
  const mbFirstVariantsId = S.pipe([
    S.head,
    S.chain(S.get(S.is($.String))("_id"))
  ])(sortedVariants)
  
  const firstVariantsId = S.maybeToNullable(mbFirstVariantsId)
  
  if (firstVariantsId === null) {
    console.log(`bailing because of variant ${S.show(firstVariantsId)} with maybe ${S.show(mbFirstVariantsId)}`)
    return <Alert intent="warning" title="Este produto não tem variações aparentemente :(" />
  }
  
  const [selectedVariantId, setSelectedVariantId] = useState(firstVariantsId)

  const selected = S.maybeToNullable(S.get(_ => true)(selectedVariantId)(indexedVariants))

  return (
    <CartContext.Consumer>
      {cart => (
        <Table.Row display="flex" key={productId} height="auto" padding={minorScale(1)} flexWrap="wrap" backgroundColor={"white"}>
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
                    {S.map(v => <Table.Row key={id(v)} isSelected={S.equals(S.prop("_id")(v))(selectedVariantId)} isSelectable onSelect={() => {
                      close()
                      setSelectedVariantId(id(v))
                    }}>
                      <Variant variant={v} sources={sources} />
                    </Table.Row>)(sortedVariants)}
                  </Table.Body>
                </Table>)}>
                <Button iconAfter={CaretDownIcon}>
                  <Variant variant={selected} sources={sources} />
                </Button>
              </Popover>
              : <Variant variant={selected} sources={sources} />
            }
          </Table.TextCell>
          <Table.TextCell flexBasis={150} paddingY={majorScale(1)}>
            {/* <ActionButtons action={(delta) => updateProductQuantityBy(cart)(productId)(selectedVariantId)(delta)} /> */}
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="space-between">
              <Button flex={"1"} appearance="minimal" onClick={() => updateProductQuantityBy(productIdValue, selectedVariantId, -getCartQuantity(cart)(productIdValue)(selectedVariantId), selected.price * selected.pack_size * -getCartQuantity(cart)(productIdValue)(selectedVariantId))}
                intent="danger">remover</Button>
              <IconButton flex={"1"} onClick={() => updateProductQuantityBy(productIdValue, selectedVariantId, -1, selected.price * selected.pack_size * -1)} icon={MinusIcon} disabled={getCartQuantity(cart)(productIdValue)(selectedVariantId) === 0} />
              <IconButton flex={"1"} onClick={() => updateProductQuantityBy(productIdValue, selectedVariantId, 1, selected.price * selected.pack_size * 1)} icon={PlusIcon} />
            </Pane>
          </Table.TextCell>
        </Table.Row>
      )}
    </CartContext.Consumer>
  )
}

export default ProductRow
