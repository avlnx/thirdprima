import LoginBox from "../../components/loginBox"
import { signIn, providers, useSession } from "next-auth/client"
import { PersonIcon, Button } from "evergreen-ui"
import { useRouter } from "next/router"
import SpinnnerBox from "../../components/spinnerBox"

const S = require("sanctuary")

const Login = ({ ps }) => {
  const [ session, loading ] = useSession()
  const auth0 = S.prop("auth0")(ps)
  const router = useRouter()
  if (loading) return <SpinnnerBox />
  if (!loading && session) router.push("/")
  
  const b = <Button intent="success" appearance="primary" onClick={() => signIn(S.prop("id")(auth0))} iconAfter={<PersonIcon />} flex={1} height={32} justifyContent="end" alignItems="center">
    Iniciar autenticação
  </Button>

  return <LoginBox signInButton={b} />
}

export default Login


export async function getServerSideProps(context) {
  const ps = await providers(context)
  return {
    props: {
      ps
    }
  }
}
