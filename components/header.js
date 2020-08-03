import Link from 'next/link'
import { Badge, Button, Heading, majorScale, minorScale, Pane, ShoppingCartIcon } from "evergreen-ui"
import { brand, palette, primaTheme } from "../theme"

const S = require("sanctuary")

function Header({ user, loading }) {
  const authenticated = !loading && user
  return (
    <Pane elevation={1} borderBottom="muted" background={brand} paddingX={majorScale(2)} paddingY={minorScale(1)} display="flex" alignItems="center" justifyContent="space-between">
      <Pane display="flex">
        <Heading size={100} color={S.prop("lightest")(palette)}>PRIMA</Heading>
        <Badge color="neutral" isSolid marginLeft={majorScale(1)}>beta</Badge>
      </Pane>

      {authenticated &&
        <>
          <Heading size={100} color={S.prop("base")(palette)}>Olá {S.fromMaybe("")(S.get(_ => true)("name")(user))}</Heading>
          <Button style={S.prop("primaryButton")(primaTheme)} height={24} onClick={() => setViewingCart(!viewingCart)} iconAfter={ShoppingCartIcon}>
            Carrinho</Button>
        </>
      }
    </Pane>
  )
}

export default Header
