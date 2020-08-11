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
import { currency, numberPropOrZero } from "../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const Variant = ({ variant }) => {
  const source = S.get(S.is($.String))("source")(variant)
  const packLabel = S.get(S.is($.String))("pack_label")(variant)
  const packUnit = S.get(S.is($.String))("pack_unit")(variant)
  // TODO: pick price based on user preference (simples, deferred)
  const price = S.get(S.is($.NonZeroValidNumber))("price")(variant)
  const quantity = S.get(S.is($.ValidNumber))("quantity")(variant)

  const data = [source, packLabel, packUnit, price]

  const invalidRender = <Alert intent="warning" title="Esta variação não está se comportando." />

  // unchecked so we can operate on different types (String and NonZeroValidNumber)
  // if any of the data items is a Nothing we fail here
  if (S.unchecked.any(S.isNothing)(data)) return invalidRender

  const [sourceValue, packLabelValue, packUnitValue, priceValue] = S.unchecked.justs(data)

  const q = S.fromMaybe(0)(quantity)

  return (
    <Pane padding={majorScale(1)} display="flex" alignItems="center" >
      {q > 0 && <Pill display="inline-flex" color="red" isSolid margin={8}>{q}</Pill>}
      <Badge color="purple">{sourceValue}</Badge>
      <Text marginLeft={majorScale(2)}>{packLabelValue}</Text>
      <Pane display="flex" alignItems="center" justifyContent="end">
        <Strong marginLeft={majorScale(2)}>{currency.format(priceValue)}</Strong>
        <Small>{packUnitValue}</Small>
      </Pane>
    </Pane>
  )
}

export default Variant
