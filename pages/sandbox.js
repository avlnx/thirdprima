import { findByIdInList, currency } from "../lib/prima"

const S = require ("sanctuary")
const $ = require ("sanctuary-def")

const data = [
  {
    _id: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 153,
        "3": 244,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 53,
        "11": 43,
      },
    },
    label: "Abacaxi cristalizado",
    imported_identifier: "QWJhY2F4aSBjcmlzdGFsaXphZG81LWtnNWYyODllOTU0ZDRjZmM2YzYzNWUzYzg4",
    pack_label: "5-kg",
    pack_size: 5,
    pack_unit: "kg",
    price: 23.5,
    price_deferred: 24,
    price_simples: 0,
    flagged: false,
    django_id: 69,
    django_source_id: 3,
    django_product_id: 1,
    source: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 158,
        "3": 149,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 60,
        "11": 136,
      },
    },
    product: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 152,
        "3": 62,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 44,
        "11": 29,
      },
    },
    lastImportedOn: {
    },
    deleted: false,
    slug: "abacaxi-cristalizado",
    quantity: 1,
    sourceLabel: "RMoura",
  },
  {
    _id: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 153,
        "3": 242,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 51,
        "11": 115,
      },
    },
    label: "Abacaxi cristalizado cx 5 kg  *",
    imported_identifier: "QWJhY2F4aSBjcmlzdGFsaXphZG8gY3ggNSBrZyAgKjUta2c1ZjI4OWU5NTRkNGNmYzZjNjM1ZTNjODY=",
    pack_label: "5-kg",
    pack_size: 5,
    pack_unit: "kg",
    price: 34.047000000000004,
    price_deferred: 35.1,
    price_simples: 0,
    flagged: false,
    django_id: 49,
    django_source_id: 1,
    django_product_id: 1,
    source: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 158,
        "3": 149,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 60,
        "11": 134,
      },
    },
    product: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 152,
        "3": 62,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 44,
        "11": 29,
      },
    },
    lastImportedOn: {
    },
    deleted: false,
    slug: "abacaxi-cristalizado-cx-5-kg",
    quantity: 0,
    sourceLabel: "JRG Alimentos",
  },
  {
    _id: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 153,
        "3": 242,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 49,
        "11": 148,
      },
    },
    label: "Abacaxi glaceado rodelas import.",
    imported_identifier: "QWJhY2F4aSBnbGFjZWFkbyByb2RlbGFzIGltcG9ydC4xMC1rZzVmMjg5ZTk1NGQ0Y2ZjNmM2MzVlM2M4OQ==",
    pack_label: "10-kg",
    pack_size: 10,
    pack_unit: "kg",
    price: 53.47,
    price_deferred: 0,
    price_simples: 0,
    flagged: false,
    django_id: 1787,
    django_source_id: 4,
    django_product_id: 1,
    source: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 158,
        "3": 149,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 60,
        "11": 137,
      },
    },
    product: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 152,
        "3": 62,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 44,
        "11": 29,
      },
    },
    lastImportedOn: {
    },
    deleted: false,
    slug: "abacaxi-glaceado-rodelas-import",
    quantity: 0,
    sourceLabel: "Elmar",
  },
  {
    _id: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 153,
        "3": 242,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 50,
        "11": 9,
      },
    },
    label: "Abacaxi seco rodelas ( desidratado )",
    imported_identifier: "QWJhY2F4aSBzZWNvIHJvZGVsYXMgKCBkZXNpZHJhdGFkbyApNS1rZzVmMjg5ZTk1NGQ0Y2ZjNmM2MzVlM2M4OA==",
    pack_label: "5-kg",
    pack_size: 5,
    pack_unit: "kg",
    price: 51,
    price_deferred: 52,
    price_simples: 0,
    flagged: false,
    django_id: 79,
    django_source_id: 3,
    django_product_id: 1060,
    source: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 158,
        "3": 149,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 60,
        "11": 136,
      },
    },
    product: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 152,
        "3": 62,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 44,
        "11": 34,
      },
    },
    lastImportedOn: {
    },
    deleted: false,
    slug: "abacaxi-seco-rodelas-desidratado",
    quantity: 2,
    sourceLabel: "RMoura",
  },
  {
    _id: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 153,
        "3": 242,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 49,
        "11": 230,
      },
    },
    label: "Abacaxi desidratado rodelas nacional",
    imported_identifier: "QWJhY2F4aSBkZXNpZHJhdGFkbyByb2RlbGFzIG5hY2lvbmFsNS1rZzVmMjg5ZTk1NGQ0Y2ZjNmM2MzVlM2M4OQ==",
    pack_label: "5-kg",
    pack_size: 5,
    pack_unit: "kg",
    price: 52,
    price_deferred: 0,
    price_simples: 0,
    flagged: false,
    django_id: 1785,
    django_source_id: 4,
    django_product_id: 1060,
    source: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 158,
        "3": 149,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 60,
        "11": 137,
      },
    },
    product: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 152,
        "3": 62,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 44,
        "11": 34,
      },
    },
    lastImportedOn: {
    },
    deleted: false,
    slug: "abacaxi-desidratado-rodelas-nacional",
    quantity: 0,
    sourceLabel: "Elmar",
  },
  {
    _id: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 153,
        "3": 242,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 49,
        "11": 182,
      },
    },
    label: "Abacaxi desidratado rodelas nacional",
    imported_identifier: "QWJhY2F4aSBkZXNpZHJhdGFkbyByb2RlbGFzIG5hY2lvbmFsMS1rZzVmMjg5ZTk1NGQ0Y2ZjNmM2MzVlM2M4OQ==",
    pack_label: "1-kg",
    pack_size: 1,
    pack_unit: "kg",
    price: 56,
    price_deferred: 0,
    price_simples: 0,
    flagged: false,
    django_id: 1784,
    django_source_id: 4,
    django_product_id: 1060,
    source: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 158,
        "3": 149,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 60,
        "11": 137,
      },
    },
    product: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 152,
        "3": 62,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 44,
        "11": 34,
      },
    },
    lastImportedOn: {
    },
    deleted: false,
    slug: "abacaxi-desidratado-rodelas-nacional",
    quantity: 0,
    sourceLabel: "Elmar",
  },
  {
    _id: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 153,
        "3": 242,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 49,
        "11": 60,
      },
    },
    label: "Abacaxi desidratado rodela cx 5 kg  *",
    imported_identifier: "QWJhY2F4aSBkZXNpZHJhdGFkbyByb2RlbGEgY3ggNSBrZyAgKjUta2c1ZjI4OWU5NTRkNGNmYzZjNjM1ZTNjODY=",
    pack_label: "5-kg",
    pack_size: 5,
    pack_unit: "kg",
    price: 69.355,
    price_deferred: 71.5,
    price_simples: 0,
    flagged: false,
    django_id: 76,
    django_source_id: 1,
    django_product_id: 1060,
    source: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 158,
        "3": 149,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 60,
        "11": 134,
      },
    },
    product: {
      _bsontype: "ObjectID",
      id: {
        "0": 95,
        "1": 40,
        "2": 152,
        "3": 62,
        "4": 77,
        "5": 76,
        "6": 252,
        "7": 108,
        "8": 99,
        "9": 94,
        "10": 44,
        "11": 34,
      },
    },
    lastImportedOn: {
    },
    deleted: false,
    slug: "abacaxi-desidratado-rodela-cx-5-kg",
    quantity: 0,
    sourceLabel: "JRG Alimentos",
  },
]

const makeProductRow = cartProducts => cartItem => {
  // "5f28983e4d4cfc6c635e2c1d": {
  // "5f2899f44d4cfc6c635e352b": 1,
  // "5f2899f24d4cfc6c635e3373": 3,
  // },

  // Just("5f28983e4d4cfc6c635e2c1d")
  // const mbProductId = S.head(S.keys(cartItem))
  const productId = S.fst (cartItem)

  // Just({
  //   "5f2899f44d4cfc6c635e352b": 1,
  //   "5f2899f24d4cfc6c635e3373": 3,
  // })
  // const mbVariantItems = S.head(S.values(cartItem))
  const variantItems = S.snd (cartItem)

  // Just([Pair (id1) (q1), Pair (id2) (q2)])
  const variantPairs = S.pairs (variantItems)

  const addVariantData = variantPair => {
    const variantId = S.fst (variantPair)
    const quantity = S.snd (variantPair)
    const variants = cartProducts[productId]["variants"]
    const variant = S.maybeToNullable (findByIdInList (variantId) (variants))
    return S.Pair(variantId)({...variant, quantity})
  }

  // [Pair (id1) (variant1 with quantity1), Pair (id2) (v2 w/ quantity2)]
  const variantPairsWithData = S.map(addVariantData) (variantPairs)

  const makeVariantRow = variantPair => {
    const variant = S.snd (variantPair)
    const quantity = S.prop ("quantity") (variant)
    const packLabel = S.prop ("pack_label") (variant)
    const packSize = S.prop ("pack_size") (variant)
    const subtotal = S.prop ("price") (variant) * quantity * packSize
    return `    +${quantity}  ${packLabel}: ${currency.format(subtotal)}`
  }

  const variantRows = S.map(makeVariantRow)(variantPairsWithData)
  
  const itemCount = S.sum (S.values (variantItems))

  const product = S.maybeToNullable (findByIdInList (productId) (cartProducts))

  const mbProductLabel = S.unchecked.value ("label") (product)
  
  const title = `+${itemCount}  ${S.fromMaybe("N/A")(mbProductLabel)}`

  return S.unlines ([title, ...variantRows])
  
}


const makeVariantRow = variant => {
  // const variant = S.snd(variantPair)
  const label = S.prop("label")(variant)
  const quantity = S.prop("quantity")(variant)
  const packLabel = S.prop("pack_label")(variant)
  const packSize = S.prop("pack_size")(variant)
  const subtotal = S.prop("price")(variant) * quantity * packSize
  return `+${quantity}  ${label} ${packLabel}: ${currency.format(subtotal)}`
}


const Sandbox = () => {

  const variantsInCart = S.filter (v => S.prop ("quantity") (v) > 0) (data)

  const groupedVariants = S.unchecked.groupBy(v1 => v2 => S.equals(v1.sourceLabel)(v2.sourceLabel))(variantsInCart)

  const printableVariants = S.map(makeVariantRow) 

  const pV = S.chain (g => {
    const pv = printableVariants (g)
    return [g[0].sourceLabel, ...pv]
  }) (groupedVariants)

  const newPurchase = data => {
    return `
Oi! Aqui é a Prima.\n
Já estamos preparando tudo para darmos continuidade no seu pedido.\n
Agora é só aguardar que nosso time vai entrar em contato.\n\n
Você comprou:\n

${S.unlines (pV)}

Total: ${}

Obrigada pela confiança,\n
Prima\n
https://prima.market\n
    `
  }
  return (<pre>{newPurchase(data)}</pre>)
}

export default Sandbox

export async function getServerSideProps(context) {
  return {
    props: {
    }
  }
}
