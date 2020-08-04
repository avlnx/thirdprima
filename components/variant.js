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
const $ = require("sanctuary-def")

const Variant = ({ variant, sources }) => {
    const url = S.prop ("url")
    const sourceUrl = S.prop ("source") (variant)
    const source = S.find(s => S.equals(url(s))(sourceUrl))(S.fromMaybe([])(sources))

    return (
        S.isNothing(source)
            ? (<Alert
                intent="danger"
                title="Ops. Algo está errado com este produto."
            />)
            : (
                <Pane padding={majorScale (1)} display="flex" alignItems="center" >
                    <Badge color="purple">{ S.maybe ("N/A") (S.prop ("label")) (source) }</Badge>
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
