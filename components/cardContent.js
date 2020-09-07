import { Card, majorScale, Text } from "evergreen-ui"
import {primaTheme} from "../theme"

const S = require("sanctuary")

const CardContent = ({ title, selected, onClick, children }) => {
  const darkBg = S.props(["palette", "neutral", "base"])(primaTheme)
  return (
    <Card flexBasis={"27%"} marginRight={"2%"} marginBottom={"2%"} flexGrow={1} padding={majorScale(2)} elevation={1} width={300} display="flex" flexDirection="column" justifyContent="space-between" background={selected ? darkBg : "white"} onClick={onClick} >
      <Text style={{ "margin": 0, "marginBottom": "10px", "color": selected ? "white" : darkBg }}>{title}</Text>
      {children}
    </Card>
  )
}

export default CardContent