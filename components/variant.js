import React, { useState } from "react"
import {
  Alert,
  Badge,
  majorScale,
  Pane,
  Pill,
  Small,
  Strong,
  Text,
} from "evergreen-ui"
import { currency, numberPropOrZero, CartContext } from "../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const Variant = ({ variant }) => {
  const sourceId = S.get(S.is($.String))("source")(variant)
  const productId = S.get(S.is($.String))("product")(variant)
  const variantId = S.get(S.is($.String))("_id")(variant)
  const packLabel = S.get(S.is($.String))("pack_label")(variant)
  const packUnit = S.get(S.is($.String))("pack_unit")(variant)
  // TODO: pick price based on user preference (simples, deferred)
  const price = S.get(S.is($.NonZeroValidNumber))("price")(variant)
  // const quantity = S.get(S.is($.ValidNumber))("quantity")(variant)

  const data = [sourceId, productId, variantId, packLabel, packUnit, price]

  const invalidRender = <Alert intent="warning" title="Esta variação não está se comportando." />

  // unchecked so we can operate on different types (String and NonZeroValidNumber)
  // if any of the data items is a Nothing we fail here
  if (S.unchecked.any(S.isNothing)(data)) return invalidRender

  const [sourceIdValue, productIdValue, variantIdValue, packLabelValue, packUnitValue, priceValue] = S.unchecked.justs(data)

  // const q = S.fromMaybe(0)(quantity)



  return (
    <CartContext.Consumer>
      {cart => (
        <Pane padding={majorScale(1)} display="flex" alignItems="center" >
          {<Pill display="inline-flex" color="red" isSolid margin={8}>{
            S.fromMaybe(0)(S.gets(S.is($.NonZeroValidNumber))([productIdValue, variantIdValue])(cart.items))
          }</Pill>}
        <Badge color="purple">{sourceIdValue}</Badge>
        <Text marginLeft={majorScale(2)}>{packLabelValue}</Text>
        <Pane display="flex" alignItems="center" justifyContent="end">
          <Strong marginLeft={majorScale(2)}>{currency.format(priceValue)}</Strong>
          <Small>{packUnitValue}</Small>
        </Pane>
      </Pane>
      )}
    </CartContext.Consumer>
    
  )
}

export default Variant
