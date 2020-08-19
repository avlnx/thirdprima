import { 
  Alert, 
  Card, 
  Heading, 
  LockIcon, 
  majorScale, 
  Pane, 
  Text, 
  Small } from "evergreen-ui"
import { primaTheme, brand, palette } from "../theme"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const Terms = () => {
  // const [session, loading] = useSession()
  // const [isDescriptionVisible, setIsDescriptionVisible] = useState(true)
  // const router = useRouter()
  // if (loading) return <SpinnerBox />
  // if (!loading && !session) router.push("/auth/login")
  // if (error) return <ErrorResponse />

  const pageDescription = <Alert
    intent="none"
    title="Termos de uso prima.market"
    margin={majorScale(2)}
    appearance="card"
    isRemoveable={true}
    onRemove={() => setIsDescriptionVisible(false)}
  >Leia nossos termos de uso em breve.</Alert>

  return (<Pane display="flex" height="100vh" alignItems="center" justifyContent="center" background={S.props(["palette", "purple", "base"])(primaTheme)}>
    <Card flexBasis={360} background={brand} elevation={3} padding={majorScale(6)} display="flex" flexDirection="column">
      <Pane display="flex">
        <LockIcon color={S.prop("lightest")(palette)} marginRight={majorScale(1)} />
        <Heading color={"white"} size={200}
          marginBottom={majorScale(2)}>
          PRIMA
        </Heading>
      </Pane>
      <Text marginTop={majorScale(3)} color={S.prop("lightest")(palette)}>
        <Small>Leia nossos termos de uso em breve.</Small>
      </Text>

    </Card>
  </Pane>)
}

export default Terms

export async function getServerSideProps(context) {
  // const { query } = context
  // const session = await getSession(context)
  return {
    props: {
    }
  }
}

