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

const LoginBox = () => {
  return <Pane display="flex" height="100vh" alignItems="center" justifyContent="center" background={S.props (["palette", "purple", "base"])(primaTheme)}>
    <Card flexBasis={360} background={brand} elevation={3} padding={majorScale(6)} display="flex" flexDirection="column">
      <Pane display="flex" >
        <LockIcon color={S.prop("lightest")(palette)} marginRight={majorScale(1)} />
        <Heading color={"white"} size={200}
          marginBottom={majorScale(2)}>
          PRIMA
        </Heading>
      </Pane>

      <Button intent="success" appearance="primary" onClick={signIn} iconAfter={<PersonIcon />} flex={1} height={32} justifyContent="end" alignItems="center">
        Iniciar Sessão
      </Button>
      <Text marginTop={majorScale(3)} color={S.prop("lightest")(palette)}>
        <Small >Você será brevemente redirecionado ao nosso parceiro especialista de autenticação Auth0.<br /> Nos vemos na volta.</Small>
      </Text>

    </Card>
  </Pane>
}

export default LoginBox