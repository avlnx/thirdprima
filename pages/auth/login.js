import { signIn, providers, useSession } from "next-auth/client"
import { useRouter } from "next/router"
import SpinnerBox from "../../components/spinnerBox"

const S = require("sanctuary")

const MARKETING_URL = "https://www.prima.market"

const Login = ({ ps, query }) => {
  const [ session, loading ] = useSession()
  const router = useRouter()
  
  session && router.push("/")
  
  const authenticate = S.elem("authenticate")(S.keys(query))
  const auth0 = S.prop("auth0")(ps)

  // sessionless
  if (!loading) {
    if (authenticate) {
      signIn(S.prop("id")(auth0))
      return null
    }
    window.location = MARKETING_URL
    return null
  }

  return <SpinnerBox message="Redirecionando..." />
}

export default Login

export async function getServerSideProps(context) {
  const ps = await providers(context)
  const { query } = context
  return {
    props: {
      ps,
      query
    }
  }
}
