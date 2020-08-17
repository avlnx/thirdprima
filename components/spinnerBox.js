import { Pane, Spinner } from "evergreen-ui"
import { brand } from "../theme"

const SpinnerBox = ({ backgroundColor }) => {
  return (
    <Pane background={backgroundColor || brand} display="flex" flex="1" alignItems="center" justifyContent="center" >
      <Pane height={64} margin={0} padding={0}>
        <Spinner size={64} />
      </Pane>
    </Pane>
  )
}

export default SpinnerBox