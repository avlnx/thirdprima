import { Pane, Spinner } from "evergreen-ui"

const SpinnerBox = () => {
  return (
    <Pane display="flex" alignItems="center" justifyContent="center" minHeight={200}>
      <Spinner />
    </Pane>
  )
}

export default SpinnerBox