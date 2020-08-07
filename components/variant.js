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
import { findByIdInList } from "../lib/prima"

const S = require("sanctuary")
const $ = require("sanctuary-def")

// stringProp :: String -> Maybe Any
const stringProp = str => S.get (S.is($.String)) (str) 

const Variant = ({ variant, sources }) => {
    const mbSourceId = stringProp ("source") (variant) 
    const mbSource = findByIdInList (S.fromMaybe ("não encontrado") (mbSourceId)) (sources)
    const jSource = S.maybeToNullable (mbSource)

    return (
        S.isNothing(mbSource)
            ? (<Alert
                intent="danger"
                title="Ops. Algo está errado com esta variação."
            />)
            : (
                <Pane padding={majorScale (1)} display="flex" alignItems="center" >
                    <Badge color="purple">{ (S.prop("label"))(jSource)
                    }</Badge>
                    <Text marginLeft={majorScale(2)}>{ S.prop ("pack_label") (variant) }</Text>
                    <Pane display="flex" alignItems="center" justifyContent="end">
                        <Strong marginLeft={majorScale(2)}>R$ { S.prop ("price")(variant) }/</Strong>
                        <Small>{  S.prop ("pack_unit") (variant) }</Small>
                    </Pane>
                </Pane>
            )
    )
}

export default Variant
