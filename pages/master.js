
import { Card, Pane } from "evergreen-ui"
import Head from "next/head"
import { primaTheme } from "../theme"
import connect from "../lib/db"
import { Button, majorScale, minorScale, Text } from "evergreen-ui"
import CardContent from "../components/cardContent"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const Master = ({variants, sources}) => {
  console.log("variants", variants)
  const lightBg = S.props(["palette", "neutral", "light"])(primaTheme)
  const getSource = id => S.maybeToNullable (S.find (s => S.prop ("_id") (s) == (id)) (sources))


  
  return (
    <>
      <Head>
        <title>Prima</title>
      </Head>

      <Pane display="flex" flexDirection="column" background={lightBg} padding={majorScale(2)}>
        <Pane>
          <Text>PRIMA</Text>
          <p>Oi Admin. Clique nas variações que você deseja agrupar em um produto. Depois é só clicar no botão e escolher (ou criar) o produto.</p>
        </Pane>

        <Pane paddingY={majorScale(2)}>
          <Button appearance="primary">Escolher produto para as variações selecionadas</Button>
        </Pane>

        <Pane display="flex" flexWrap="wrap">
          {S.unchecked.map(v => (
            <CardContent key={v._id} title={v.label}>
              @{getSource(v.source).label}<br />
                R$ {v.price} / {v.pack_size}{v.pack_unit}
            </CardContent>
          ))(variants)}
        </Pane>

      </Pane>
    </>
  )
}

export default Master

const getThings = async (db, things, queryObject = {}) => {
  const collection = await db.collection(things)
  const options = { limit: 25 }
  // const options = {}
  const results = await collection.find(queryObject, options)
  const stuff = await results.toArray()
  return stuff
}

export const getVariants = async (db) => {
  // todo: filter flagged variants
  const vs = await getThings(db, "variants", { product: null })
  return JSON.stringify(vs)
}

export const getSources = async (db) => {
  const vs = await getThings(db, "sources")
  return JSON.stringify(vs)
}

export async function getServerSideProps(context) {
  const db = await connect()
  
  const variants = S.parseJson(S.is($.Array($.Object)))(await getVariants(db))
  const sources = S.parseJson(S.is($.Array($.Object)))(await getSources(db))

  return {
    props: {
      variants: S.maybeToNullable (variants),
      sources: S.maybeToNullable (sources)
    }
  }
}