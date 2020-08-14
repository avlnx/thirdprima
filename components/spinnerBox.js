import { Pane, Spinner } from "evergreen-ui"
import { brand } from "../theme"

const SpinnerBox = ({ backgroundColor }) => {
  return (
    <Pane height="100vh" background={backgroundColor || brand} display="flex" flex="1" alignItems="center" justifyContent="center" >
      <Spinner size={64} />
    </Pane>
  )
}

export default SpinnerBox