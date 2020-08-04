import {
    ArrowRightIcon,
    Badge,
    Button,
    Card,
    Heading,
    majorScale,
    Pane,
} from "evergreen-ui"
import Link from "next/link"
import { primaTheme } from "../theme"

const S = require ("sanctuary")

const Totalizer = ({ viewingCart, total }) => {
    return <Card elevation={1} margin={majorScale(2)} padding={majorScale(2)} display="flex" alignItems="center" justifyContent="space-between" background={"white"}>
        <Pane display="flex" alignItems="center">
            <Badge color="purple" marginRight={majorScale(1)}>Total</Badge>
            <Heading size={500}>{ total }</Heading>
        </Pane>
        {viewingCart
            ?
            <Pane display="flex" alignItems="center">
                <Link href="/" style={{ color: "red", marginRight: majorScale (2)}}>Sair</Link>
                <Button height={48} appearance="primary" intent="success" onClick={() => alert("promote this bitch")} iconAfter={ArrowRightIcon}>Confirmar pedido
              </Button>
            </Pane>
            :
            <Button style={S.prop("primaryButton")(primaTheme)} height={48} onClick={() => setViewingCart(true)} iconAfter={ArrowRightIcon}>Visualizar carrinho.
            </Button>}
    </Card>
}

export default Totalizer