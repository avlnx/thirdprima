import {
  ArrowRightIcon,
  Badge,
  Button,
  Card,
  defaultTheme,
  Heading,
  majorScale,
  minorScale,
  Pane,
  Pill,
  ShoppingCartIcon,
  Spinner,
} from "evergreen-ui"
import Link from "next/link"
import { primaTheme } from "../theme"
const S = require("sanctuary")

const Totalizer = ({ inCart: viewingCart, total, loading, count, clearCart }) => {
  return (
    <Card elevation={1} margin={majorScale(2)} padding={majorScale(2)} display="flex" alignItems="center" justifyContent="space-between" background={"white"}>
      {loading ? <Spinner /> : null}
      <Pane display="flex" flexDirection="column" alignItems="flex-start">
        <Badge color="purple" marginBottom={minorScale(1)}>Total</Badge>
        <Pane display="flex" alignItems="center" justifyContent="flex-start">

        <Heading size={500}>{total}</Heading>
        <Button appearance="minimal" onClick={() => clearCart()} intent="danger">Esvaziar</Button>
        </Pane>
      </Pane>
      <Pane>
        {/* <Button appearance="minimal" onClick={() => clearCart()} intent="danger">Limpar</Button> */}
        <Pill style={{ position: "relative", bottom: "25px", left: "5px", zIndex: "10"}} display="inline-block" color="red" isSolid marginRight={-minorScale(1)}  >{count}</Pill>
      {viewingCart ?
          <>
          <Button height={48} appearance="primary" style={{ background: S.props(["colors", "intent", "success"]) (primaTheme)}} onClick={() => alert("promote this bitch")} iconAfter={ArrowRightIcon}>Finalizar pedido</Button>
            
          </>
          :
          <><Link href="/cart" >
            <Button height={48} appearance="primary" style={S.prop("primaryButton")(primaTheme)} iconAfter={ShoppingCartIcon}>Carrinho</Button>
          </Link></>}
        <Link href="/" >
          <Button appearance="minimal" intent="danger">Voltar</Button>
        </Link>
        </Pane>
    </Card>
  )
}


export default Totalizer