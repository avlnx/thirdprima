
import { Badge, Button, Card, IconButton, majorScale, Pane, PlusIcon,  Text } from "evergreen-ui"
import Head from "next/head"
import { primaTheme } from "../theme"
import connect from "../lib/db"
import CardContent from "../components/cardContent"
import { useState } from "react"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const Master = ({ variants, sources }) => {
  const lightBg = S.props(["palette", "neutral", "light"])(primaTheme)
  const getSource = id => S.maybeToNullable (S.find (source => S.prop ("_id") (source) == (id)) (sources))
  const [ selectedVs, setSelectedVs ] = useState([])

  const filteredVs = v => S.filter(variant => { return (variant._id != v._id) })

  const selectVariant = v => {
    // const filteredVs = S.filter(variant => { return (variant._id != v._id) })(selectedVs)
    const filtered = filteredVs (v) (selectedVs)
    setSelectedVs([...filtered, v])
  }
  const boundSelVar = selectVariant.bind(this)

  const deselectVariant = v => {
    const filtered = filteredVs (v) (selectedVs)
    setSelectedVs(filtered)
  }
  const boundDeselVar = deselectVariant.bind(this)

  const isSelected = v => S.size(S.filter(variant => { return (variant._id == v._id) })(selectedVs)) > 0

  const availableVs = S.unchecked.reject (isSelected) (variants)

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

        <Pane display="flex" flexWrap="wrap">
          {S.size(selectedVs) == 0 && <Text>As variações que você selecionar vão aparecer aqui.</Text>}
          {S.unchecked.map(v => (
            <CardContent key={v._id} title={v.label} selected={true} onClick={boundDeselVar} v={v}>
              <Pane display="flex" justifyContent="space-between">
                <small>
                  <pre style={{ "margin": 0, "color": "#ccc" }}>
                    R$ {v.price} / {v.pack_size}{v.pack_unit}
                  </pre>
                </small>
                <Badge color="purple" marginRight={8}>@{getSource(v.source).symbol}</Badge>
              </Pane>
            </CardContent>
          ))(selectedVs)}
        </Pane>

        <Pane paddingY={majorScale(2)}>
          <Button appearance="primary">Escolher produto para as variações selecionadas</Button>
        </Pane>

        <Pane display="flex" flexWrap="wrap">
          {S.unchecked.map(v => (
            <CardContent key={v._id} title={v.label} selected={false} onClick={boundSelVar} v={v}>
              <Pane display="flex" justifyContent="space-between">
                <small>
                  <pre style={{ "margin": 0 }}>
                    R$ {v.price} / {v.pack_size}{v.pack_unit}
                  </pre>
                </small>
                <Badge color="purple" marginRight={8}>@{getSource(v.source).symbol}</Badge>
              </Pane>
            </CardContent>
          ))(availableVs)}
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