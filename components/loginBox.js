import { 
  Button,
  Card,
  Heading,
  LockIcon,
  majorScale,
  Pane,
  PersonIcon,
  Small,
  Text,
} from "evergreen-ui"
import { brand, palette, primaTheme } from "../theme"
import { signIn } from "next-auth/client"

const S = require ("sanctuary")

const LoginBox = ({ signInButton }) => {
  // We have only one provider in the next-auth sense of things, auth0
  // so we just get the head of the providers
  // const auth0 = S.prop ("auth0") (providers)7
  return <Pane display="flex" height="100vh" alignItems="center" justifyContent="center" background={S.props (["palette", "purple", "base"])(primaTheme)}>
    <Card flexBasis={360} background={brand} elevation={3} padding={majorScale(6)} display="flex" flexDirection="column">
      <Pane display="flex">
        <LockIcon color={S.prop("lightest")(palette)} marginRight={majorScale(1)} />
        <Heading color={"white"} size={200}
          marginBottom={majorScale(2)}>
          PRIMA
        </Heading>
      </Pane>
      {signInButton}
      <Text marginTop={majorScale(3)} color={S.prop("lightest")(palette)}>
        <Small >Você será brevemente redirecionado ao nosso parceiro especialista de autenticação Auth0.<br /> Nos vemos na volta.</Small>
      </Text>

    </Card>
  </Pane>
}

export default LoginBox