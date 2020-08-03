import { Heading, majorScale, Pane, Switch } from "evergreen-ui"

const BlockSwitch = ({ checked, onChange}) => 
    <Pane alignItems={"center"} justifyContent={"center"} display="flex" marginX={majorScale(2)} marginTop={majorScale(2)}>
        <Switch height={32} checked={checked} onChange={onChange} />
        <Heading size={400} marginLeft={majorScale(2)}>Visualizar Carrinho</Heading>
    </Pane>

export default BlockSwitch