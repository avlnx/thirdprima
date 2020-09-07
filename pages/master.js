
import { Badge, Button, Card, Dialog, Heading, IconButton, majorScale, Pane, PlusIcon, Text, TextInput } from "evergreen-ui"
import Head from "next/head"
import { primaTheme } from "../theme"
import connect from "../lib/db"
import CardContent from "../components/cardContent"
import { useState } from "react"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const Master = ({ variants, sources, products }) => {
  const lightBg = S.props(["palette", "neutral", "light"])(primaTheme)
  const getSource = id => S.maybeToNullable(S.find(source => S.prop("_id")(source) == (id))(sources))
  const [selectedVs, setSelectedVs] = useState([])
  const [pickingProduct, setPickingProduct] = useState(false)

  const filteredVs = v => S.filter(variant => { return (variant._id != v._id) })

  const selectVariant = v => {
    // const filteredVs = S.filter(variant => { return (variant._id != v._id) })(selectedVs)
    const filtered = filteredVs(v)(selectedVs)
    setSelectedVs([...filtered, v])
  }
  const boundSelVar = selectVariant.bind(this)

  const deselectVariant = v => {
    const filtered = filteredVs(v)(selectedVs)
    setSelectedVs(filtered)
  }
  const boundDeselVar = deselectVariant.bind(this)

  const isSelected = v => S.size(S.filter(variant => { return (variant._id == v._id) })(selectedVs)) > 0

  const availableVs = S.unchecked.reject(isSelected)(variants)

  const selectedVariantsList = S.unchecked.map(v => (
    <CardContent key={v._id} title={v.label} selected={true} onClick={() => boundDeselVar(v)} v={v}>
      <Pane display="flex" justifyContent="space-between">
        <small>
          <pre style={{ "margin": 0, "color": "#ccc" }}>
            R$ {v.price} / {v.pack_size}{v.pack_unit}
          </pre>
        </small>
        <Badge color="purple" marginRight={8}>@{getSource(v.source).symbol}</Badge>
      </Pane>
    </CardContent>
  ))(selectedVs)

  const setVariantsProduct = vs => async p => {
    console.log(`About to set ${S.size(vs)} variants to product: ${p._id}`)
    const data = {
      "variants": vs, "product": p._id
    }
    return await fetch("/api/master", {
      method: "post",
      body: JSON.stringify(data)
    }).then (checkStatus)
  }

  // export const postNextCartState = async (nextCart) => {
  //   // setQuantity(S.max(0)(quantity + delta))
  //   return await fetch("/api/cart", {
  //     method: "post",
  //     body: JSON.stringify(nextCart)
  //   }).then(checkStatus)
  // }

  function checkStatus(response) {
    if (response.ok) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      return Promise.reject(error)
    }
  }


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

        <Dialog
          isShown={pickingProduct}
          title="Escolha ou crie um produto para as variações abaixo."
          onCloseComplete={() => setPickingProduct(false)}
          hasFooter={false}
        >
          <Pane marginBottom={majorScale(6)} display="flex" flexWrap="wrap">
            {selectedVariantsList}
          </Pane>
          <Pane marginBottom={majorScale(6)}>
            <Heading size={500} marginTop="default">Crie um novo produto</Heading>
            <TextInput
              name="product"
              placeholder="Nome do novo produto"
            />
            <Button appearance="primary">Criar e linkar produto</Button>
          </Pane>

          <Heading size={500} marginTop="default" marginBottom={majorScale(1)}>Ou escolha entre um dos produtos existentes. É só clicar.</Heading>
          <Pane display="flex" flexWrap="wrap">
            {S.unchecked.map(p => {
              // console.log(p)
              return (<CardContent key={p._id} title={p.label} onClick={() => setVariantsProduct (selectedVs) (p)}>
              </CardContent>)
            })(products)}
          </Pane>
        </Dialog>

        <Pane display="flex" flexWrap="wrap">
          {S.size(selectedVs) == 0 && <Text>As variações que você selecionar vão aparecer aqui. Se quiser retirar uma variação do grupo é só clicar de novo nela que ela volta lá pra baixo.</Text>}
          {selectedVariantsList}
        </Pane>

        <Pane>
          <Button onClick={() => setPickingProduct(true)} appearance="primary">Escolher produto para as variações selecionadas</Button>
        </Pane>

        <Pane display="flex" flexWrap="wrap" marginTop={majorScale(2)}>
          {S.unchecked.map(v => (
            <CardContent key={v._id} title={v.label} selected={false} onClick={() => boundSelVar(v)} v={v}>
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

export const getProducts = async (db) => {
  const products = await getThings(db, "products", { "variants": { $not: { $size: 0 } } })
  return JSON.stringify(products)
}

export async function getServerSideProps(context) {
  const db = await connect()

  const variants = S.parseJson(S.is($.Array($.Object)))(await getVariants(db))
  const sources = S.parseJson(S.is($.Array($.Object)))(await getSources(db))
  const products = S.parseJson(S.is($.Array($.Object)))(await getProducts(db))

  return {
    props: {
      variants: S.maybeToNullable(variants),
      sources: S.maybeToNullable(sources),
      products: S.maybeToNullable(products),
    }
  }
}