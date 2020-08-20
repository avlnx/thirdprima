import { signIn, providers, useSession } from "next-auth/client"
import { useRouter } from "next/router"
import SpinnerBox from "../../components/spinnerBox"
import { useEffect } from "react"

const S = require("sanctuary")

const MARKETING_URL = "https://www.prima.market"

const Login = ({ ps, query }) => {
  const [ session, loading ] = useSession()
  const router = useRouter()
  
  useEffect(() => {
    session && router.push("/")
    // sessionless
    if (!loading) {
      const authenticate = S.elem("authenticate")(S.keys(query))
      if (authenticate) {
        const auth0 = S.prop("auth0")(ps)
        signIn(S.prop("id")(auth0), { callbackUrl: process.env.BASE_URL})
        return null
      }
      window.location = MARKETING_URL
      return null
    }
  }, [loading, session])

  const msg = "Autenticando..."

  return <SpinnerBox message={msg} />
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
