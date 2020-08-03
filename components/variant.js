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
import { findSourceNameById, lastItemInUrl } from "./productRow"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const Variant = ({ variant, sources }) => {
    const source = S.get (S.is ($.String)) ("source") (variant)

    return (
        S.isNothing(source)
            ? (<Alert
                intent="danger"
                title="Ops. Algo está errado com este produto."
            />)
            : (
                <Pane padding={majorScale (1)} display="flex" alignItems="center" >
                    <Badge color="purple">{ findSourceNameById (lastItemInUrl (S.maybeToNullable (source))) (sources) }</Badge>
                    <Text marginLeft={majorScale(2)}>{S.prop("pack_label")(variant)}</Text>
                    <Pane display="flex" alignItems="center" justifyContent="end">
                        <Strong marginLeft={majorScale(2)}>R$ {S.prop("price")(variant)}/</Strong>
                        <Small>{S.prop("pack_unit")(variant)}</Small>
                    </Pane>
                </Pane>
            )
    )
}

export default Variant
