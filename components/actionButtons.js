import { Button, IconButton, MinusIcon, Pane, PlusIcon } from "evergreen-ui"

const ActionButtons = ({ action }) => <Pane
  display="flex"
  alignItems="center"
  justifyContent="space-between">
  <Button flex={"1"} appearance="minimal" onClick={() => action(-Infinity)}
    intent="danger">remover</Button>
  <IconButton flex={"1"} onClick={() => action(-1)} icon={MinusIcon} />
  <IconButton flex={"1"} onClick={() => action(1)} icon={PlusIcon} />
</Pane>

export default ActionButtons