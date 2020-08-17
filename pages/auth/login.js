import LoginBox from "../../components/loginBox"
import { signIn, providers, useSession } from "next-auth/client"
import { PersonIcon, Button } from "evergreen-ui"
import { useRouter } from "next/router"
import SpinnerBox from "../../components/spinnerBox"
import { useState } from "react"

const S = require("sanctuary")

const Login = ({ ps }) => {
  const [ session, loading ] = useSession()
  const [ isRouting, setIsRouting ] = useState(false)
  const auth0 = S.prop("auth0")(ps)
  const router = useRouter()

  if (loading) return <SpinnerBox />

  if (!loading && session) router.push("/")

  const authenticate = () => {
    setIsRouting(true)
    signIn(S.prop("id")(auth0))
  }
  
  const b = <Button intent="success" appearance="primary" onClick={() => authenticate() } iconAfter={<PersonIcon />} flex={1} height={32} justifyContent="end" alignItems="center" isLoading={isRouting}>
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
