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
import { brand, palette } from "../theme"

const S = require ("sanctuary")

const LoginBox = () => {
  return <Pane display="flex" height="100vh" alignItems="center" justifyContent="center" >
    <Card flexBasis={360} background={brand} elevation={4} padding={majorScale(6)} display="flex" flexDirection="column">
      <Pane display="flex" >
        <LockIcon color={S.prop("lightest")(palette)} marginRight={majorScale(1)} />
        <Heading color={"white"} size={200}
          marginBottom={majorScale(2)}>
          PRIMA
                </Heading>
      </Pane>

      <Button intent="success" appearance="primary" is="a" href="/api/login" iconAfter={<PersonIcon />} flex={1} height={32} justifyContent="end" alignItems="center">
        Iniciar Sessão
            </Button>
      <Text marginTop={majorScale(3)} color={S.prop("lightest")(palette)}>
        <Small >Você será brevemente redirecionado ao nosso parceiro especialista de autenticação Auth0.<br /> Nos vemos na volta.</Small>
      </Text>

    </Card>
  </Pane>
}

export default LoginBox