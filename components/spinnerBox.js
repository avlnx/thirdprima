import { Heading, majorScale, Pane, Spinner } from "evergreen-ui"
import { brand } from "../theme"

const SpinnerBox = ({ backgroundColor, message }) => {
  return (
    <Pane height={"100vh"}  background={backgroundColor || brand} display="flex" flex="1" alignItems="center" justifyContent="center" flexDirection="column" >
      <Pane height={64} flexBasis={64} flexGrow={0} flexShrin={0} margin={0} padding={0}>
        <Spinner size={64} />
      </Pane>
      <Heading marginTop={majorScale (2)} size={200}>{message || "Por favor, aguarde..."}</Heading>
    </Pane>
  )
}

export default SpinnerBox