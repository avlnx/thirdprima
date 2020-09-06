import { Card, majorScale, Text } from "evergreen-ui"

const CardContent = ({ key, title, children }) => {
  return (
    <Card flexBasis={"27%"} marginRight={"2%"} marginBottom={"2%"} flexGrow={1} padding={majorScale(2)} elevation={1} width={300} display="flex" flexDirection="column" justifyContent="space-between" key={key} background={"white"} onClick={() => alert("oi")}>
      <Text style={{ "margin": 0, "marginBottom": "10px" }}>{title}</Text>
      <small><pre style={{ "margin": 0 }}>
        {children}
      </pre></small>
    </Card>
  )
}

export default CardContent