import {
  ArrowRightIcon,
  Badge,
  Button,
  Card,
  defaultTheme,
  Heading,
  majorScale,
  Pane,
  Pill,
  ShoppingCartIcon,
  Spinner,
} from "evergreen-ui"
import Link from "next/link"
import { primaTheme } from "../theme"
const S = require("sanctuary")

const Totalizer = ({ viewingCart, total, loading, count }) => {
  return (
    <Card elevation={1} margin={majorScale(2)} padding={majorScale(2)} display="flex" alignItems="center" justifyContent="space-between" background={"white"}>
      {loading ? <Spinner /> : null}
      <Pane display="flex" alignItems="center">
        <Badge color="purple" marginRight={majorScale(1)}>Total</Badge>
        <Heading size={500}>{total}</Heading>
      </Pane>
      <Pane>
        <Pill display="inline-flex" color="red" isSolid margin={8}>{count}</Pill>
      {viewingCart ?
          <><Link href="/" >
            <Button appearance="minimal" intent="danger">Cancelar</Button>
          </Link>
          <Button height={48} appearance="primary" style={S.prop("primaryButton")(primaTheme)} onClick={() => alert("promote this bitch")} iconAfter={ArrowRightIcon}>Finalizar pedido</Button></>
          :
          <><Link href="/cart" >
            <Button height={48} appearance="primary" style={S.prop("primaryButton")(primaTheme)} iconAfter={ShoppingCartIcon}>Carrinho</Button>
          </Link></>}
        </Pane>
    </Card>
  )
}


export default Totalizer