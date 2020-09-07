
import { Badge, Button, Dialog, Heading, majorScale, Pane, Text, TextInput, toaster } from "evergreen-ui"
import Head from "next/head"
import { primaTheme } from "../theme"
import connect from "../lib/db"
import CardContent from "../components/cardContent"
import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

const S = require("sanctuary")
const $ = require("sanctuary-def")

const Master = ({ variants, sources, products }) => {
  const lightBg = S.props(["palette", "neutral", "light"])(primaTheme)
  const getSource = id => S.maybeToNullable(S.find(source => S.prop("_id")(source) == (id))(sources))
  const [selectedVs, setSelectedVs] = useState([])
  const [pickingProduct, setPickingProduct] = useState(false)
  const [newProductLabel, setNewProductLabel] = useState("")
  const router = useRouter()

  const filteredVs = v => S.filter(variant => { return (variant._id != v._id) })

  const selectVariant = v => {
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

  const setVariantsProduct = async ({ vs, p, newProdLabel }) => {
    const data = {
      "variants": vs, "product": p._id, "newProdLabel": newProdLabel
    }
    const res = await fetch("/api/master", {
      method: "post",
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      var error = new Error(res.statusText)
      error.response = res
      return Promise.reject(error)
    }
    // response ok
    setSelectedVs([])
    setPickingProduct(false)
    router.reload()
    toaster.success("Variações atualizadas com sucesso. Recarregando...")
    return res
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
              onChange={e => setNewProductLabel(e.target.value)}
              value={newProductLabel}
            />
            <Button onClick={() => setVariantsProduct({"vs": selectedVs, "p": {}, "newProdLabel": newProductLabel})} appearance="primary">Criar e linkar produto</Button>
          </Pane>

          <Heading size={500} marginTop="default" marginBottom={majorScale(1)}>Ou escolha entre um dos produtos existentes. É só clicar.</Heading>
          <Pane display="flex" flexWrap="wrap">
            {S.unchecked.map(p => {
              return (<CardContent key={p._id} title={p.label} onClick={() => setVariantsProduct ({"vs": selectedVs, "p": p})}>
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

export const getVariants = async (db) => {
  // todo: filter flagged variants
  const vs = await db.collection("variants").find({ product: null }, { limit: 80 }).sort({label: 1}).toArray()
  return JSON.stringify(vs)
}

export const getSources = async (db) => {
  const ss = await db.collection("sources").find({}).toArray()
  return JSON.stringify(ss)
}

export const getProducts = async (db) => {
  const ps = await db.collection("products").find({}).project({_id: 1, label: 1}).sort({ label: 1 }).toArray()
  return JSON.stringify(ps)
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