import { Badge, Button, Heading, majorScale, minorScale, Pane } from "evergreen-ui"
import { brand, palette } from "../theme"
import { signOut } from "next-auth/client"

const S = require("sanctuary")

function Header({ user, loading }) {
  const authenticated = !loading && user
  return (
    <>
      <Pane elevation={0} borderBottom="muted" background={"white"} paddingX={majorScale(2)} paddingY={minorScale(1)} display="flex" alignItems="center" justifyContent="space-between">
        <Heading size={300}>Quer falar com um humano? Chame o Fábio: (011) 98290-4218</Heading>
      </Pane>
      <Pane elevation={0} borderBottom="muted" background={brand} paddingX={majorScale(2)} paddingY={minorScale(1)} display="flex" alignItems="center" justifyContent="space-between">
        <Badge color="neutral" isSolid marginLeft={majorScale(1)}>beta</Badge>
        
        {authenticated &&
          <>
            <Heading size={100} color={S.prop("base")(palette)}>Olá {S.fromMaybe("")(S.get(_ => true)("name")(user))}</Heading>
            <Button appearance="minimal" onClick={signOut} style={{ color: "white", textDecoration: "underline"}} height={24}>
              Sair</Button>
          </>
        }
      </Pane>
    </>
  )
}

export default Header
