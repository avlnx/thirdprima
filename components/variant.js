import React from "react"
import {
  Alert,
  Badge,
  majorScale,
  Pane,
  Small,
  Strong,
  Text
} from "evergreen-ui"

const S = require("sanctuary")

const Variant = ( { variant } ) => {
  return (
    <Pane padding={ majorScale (1) } display="flex" alignItems="center" >
      <Badge color="purple">{ S.prop ("source") (variant) }</Badge>
      <Text marginLeft={ majorScale (2) }>{ S.prop ("pack_label") (variant) }</Text>
      <Pane display="flex" alignItems="center" justifyContent="end">
        <Strong marginLeft={ majorScale (2) }>R$ { S.prop ("price") (variant) }/</Strong>
        <Small>{ S.prop ("pack_unit") (variant) }</Small>
      </Pane>
    </Pane>
  )
}

export default Variant
