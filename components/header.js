import Link from 'next/link'
import { Badge, Button, Heading, majorScale, minorScale, Pane, ShoppingCartIcon } from "evergreen-ui"
import { brand, palette, primaTheme } from "../theme"

const S = require ("sanctuary")

function Header({ user, loading }) {
  return (
    <Pane elevation={1} borderBottom="muted" background={brand} paddingX={majorScale(2)} paddingY={minorScale(1)} display="flex" alignItems="center" justifyContent="space-between">
      <Pane display="flex">
        <Heading size={100} color={S.prop("lightest")(palette)}>PRIMA</Heading>
        <Badge color="neutral" isSolid marginLeft={majorScale(1)}>beta</Badge>
      </Pane>

      {!loading &&
        (user ? (
        <Heading size={100} color={S.prop("base")(palette)}>Olá {S.fromMaybe("")(S.get(_ => true)("name")(user))}</Heading>
          // <>
          //   <li>
          //     <Link href="/profile">
          //       <a>Client-rendered profile</a>
          //     </Link>
          //   </li>
          //   <li>
          //     <Link href="/advanced/ssr-profile">
          //       <a>Server rendered profile (advanced)</a>
          //     </Link>
          //   </li>
          //   <li>
          //     <a href="/api/logout">Logout</a>
          //   </li>
          // </>
          
        ) : (
            <li>
              <a href="/api/login">Login</a>
            </li>
          ))}
      

      <Button style={S.prop("primaryButton")(primaTheme)} height={24} onClick={() => setViewingCart(!viewingCart)} iconAfter={ShoppingCartIcon}>
        Carrinho</Button>
    </Pane>
  )
}

export default Header
