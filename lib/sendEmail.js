import fetch from "isomorphic-unfetch"
import { isDev, bruxo } from "../config"
const S = require("sanctuary")
const $ = require("sanctuary-def")

const SENDGRID_API = "https://api.sendgrid.com/v3/mail/send"
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

export const sendEmail = async ({ to, subject, html, text }) => {
  return await fetch(SENDGRID_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SENDGRID_API_KEY}`
    },
    body: JSON.stringify({
      personalizations: [{ to, subject }],
      from: {
        email: "noreply@prima.market",
        name: "Prima"
      },
      reply_to: {
        email: "fabio@prima.market"
      },
      content: [
        // {
        //   type: "text/html",
        //   value: html
        // },
        {
          type: "text/plain",
          value: text
        }
      ]
    })
  })
}

const makeVariantRow = variant => {
  const label = S.prop("label")(variant)
  const quantity = S.prop("quantity")(variant)
  const packLabel = S.prop("pack_label")(variant)
  const packSize = S.prop("pack_size")(variant)
  const subtotal = S.prop("price")(variant) * quantity * packSize
  return `+${quantity}  ${label} ${packLabel}: R$ ${subtotal}`
}

const grabMessageTemplate = format => key => {
  const headerPlain = `
                _
    ____  _____(_)___ ___  ____ _
   / __ \\/ ___/ / __ \`__ \\/ __ \`/
  / /_/ / /  / / / / / / / /_/ /
 / .___/_/  /_/_/ /_/ /_/\\____/
/_/
`
  const header = ""
  const dir = {
    plain: {
      newPurchase: (data) => {
        const variantsInCart = S.filter(v => S.prop("quantity")(v) > 0)(data.variantsWithCartData)

        const groupedVariants = S.unchecked.groupBy(v1 => v2 => S.equals(v1.sourceLabel)(v2.sourceLabel))(variantsInCart)

        const printableVariants = S.map(makeVariantRow)

        const pV = S.chain(g => {
          const pv = printableVariants(g)
          return ["", g[0].sourceLabel, ...pv]
        })(groupedVariants)

        return `     
${header}\n
Oi ${S.prop("name")(data)}! Aqui é a Prima.\n
Já estamos preparando tudo para darmos continuidade no seu pedido. Agora é só aguardar nosso time entrar em contato.\n

Você comprou:\n

${S.unlines(pV)}

Total: R$ ${data.cart.total}\n

Obrigada pela confiança,\n\n

Prima\n
https://prima.market\n
    `}
    },
    html: {
      newPurchase: (data) => {
        const variantsInCart = S.filter(v => S.prop("quantity")(v) > 0)(data.variantsWithCartData)

        const groupedVariants = S.unchecked.groupBy(v1 => v2 => S.equals(v1.sourceLabel)(v2.sourceLabel))(variantsInCart)

        const printableVariants = S.map(makeVariantRow)

        const pV = S.chain(g => {
          const pv = printableVariants(g)
          return ["", g[0].sourceLabel, ...pv]
        })(groupedVariants)

        return `
<pre>${header}</pre>
<p>Oi ${S.prop("name")(data)}! Aqui é a Prima.</p>
<p>Já estamos preparando tudo para darmos continuidade no seu pedido. Agora é só aguardar que nosso time vai entrar em contato.</p>

<p>Você comprou:</p>

<pre>
${S.unlines(pV)}

Total: R$ ${data.cart.total}
</pre>

<p>Obrigada pela confiança,</p>

<p>Prima
<a href="https://prima.market">https://prima.market</a></p>
    `}
    }
  }
  return S.prop(key)(S.prop(format)(dir))
}

const grabHtmlMessageTemplate = grabMessageTemplate("html")
const grabPlainMessageTemplate = grabMessageTemplate("plain")

export const makePurchaseEmail = data => {
  const key = S.prop("key")(data)
  return {
    to: isDev ? [
      {email: S.prop("to")(data)}, 
      { email: bruxo }
    ] : [S.prop("to")(data), "fabio@prima.market", "gustavo@prima.market", "jubiracy@prima.market", "guilherme@prima.market", "dev@prima.market", bruxo],
    subject: S.prop("subject")(data),
    text: grabPlainMessageTemplate(key)(data),
    html: grabHtmlMessageTemplate(key)(data),
  }
}
