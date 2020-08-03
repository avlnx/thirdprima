import { useState } from "react"
import Layout from '../components/layout'
import { useFetchUser } from '../lib/user'
import {
  Button,
  Card,
  Heading,
  LockIcon,
  majorScale,
  Pane,
  PersonIcon,
  Small,
  Spinner,
  Text,
} from "evergreen-ui"
import BlockSwitch from "../components/switch"
import ProductList from "../components/productList"
import Paginator from "../components/paginator"
import Totalizer from "../components/totalizer"
import { brand, primaTheme, palette } from "../theme"

const S = require("sanctuary")

function Home({ products }) {
  const { user, loading } = useFetchUser()
  const [currentPage, setCurrentPage] = useState(1) // start at page 1
  const [query, setQuery] = useState('') // start "not searching"

  const [viewingCart, setViewingCart] = useState(false)

  const apiEndpointGivenCurrentState = `http://localhost:9000/api/products/?page=${currentPage}${query ? "&search=" + query : ''}`

  // const { data, error } = useSWR ([apiEndpointGivenCurrentState, token], tokenFetcher, {"shouldRetryOnError": false})

  const getCount = S.get(_ => true)("count")
  const dataCount = getCount(products)  // Maybe(1000)

  const getResults = S.get(_ => true)("results")
  const dataResultsCount = S.maybe(0)(S.size)(getResults(products))  // 0 or 50 for example

  const numPages = Math.ceil(S.maybe(0)(n => S.div(dataResultsCount)(n))(dataCount))

  return (
    <Layout user={user} loading={loading} hideHeader={ true }>

      {loading && <Spinner />}

      {!loading && !user && (
        <Pane display="flex" height="100vh" alignItems="center" justifyContent="center" >
          <Card flexBasis={300} background={brand} elevation={4} padding={ majorScale (3) } display="flex" flexDirection="column">
            <Pane display="flex" >
              <LockIcon color={ S.prop ("lightest") (palette) } marginRight={ majorScale (1) } /> 
              <Heading color={ "white" } size={200} 
                marginBottom={majorScale(2)}>
                PRIMA
                </Heading>
            </Pane>
            
            
              <Button intent="success" as="a" href="/api/login" iconAfter={<PersonIcon />}  flex={1} height={ 32 } justifyContent="end" alignItems="center">
                Iniciar Sessão
            </Button>
            <Text marginTop={majorScale(3)} color={ S.prop ("lightest") (palette)}>
              <Small >Você será brevemente redirecionado ao nosso parceiro especialista de autenticação Auth0.<br /> Nos vemos na volta.</Small>
            </Text>
            
          </Card>
        </Pane>
      )}

      {user && (
        <>
          <BlockSwitch checked={viewingCart} onChange={() => setViewingCart(!viewingCart)} />

          <ProductList viewingCart={viewingCart} loading={loading} products={products} />

          <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} totalResults={S.fromMaybe(0)(dataCount)} />

          <Totalizer viewingCart={viewingCart} setViewingCart={setViewingCart} total={"R$ 100.099,35"} />
        </>
      )}

      {/* <h1>Next.js and Auth0 Example</h1>

      {loading && <p>Loading login info...</p>}

      {!loading && !user && (
        <>
          <p>
            To test the login click in <i>Login</i>
          </p>
          <p>
            Once you have logged in you should be able to click in{' '}
            <i>Profile</i> and <i>Logout</i>
          </p>
        </>
      )}

      {user && (
        <>
          <h4>Rendered user info on the client</h4>
          <img src={user.picture} alt="user picture" />
          <p>nickname: {user.nickname}</p>
          <p>name: {user.name}</p>
        </>
      )} */}
    </Layout>
  )
}

export default Home

export const getStaticProps = async () => {
  const res = await fetch(`http://localhost:9000/api/products/`)
  const products = await res.json()

  return {
    props: {
      products
    }
  }
}