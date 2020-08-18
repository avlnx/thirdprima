import { grabCartsProducts, findByIdInList, currency } from "../../lib/prima"
import connect from "../../lib/db"
import { isDev, bruxo } from "../../config"

const sgMail = require("@sendgrid/mail")
const S = require("sanctuary")
const $ = require("sanctuary-def")

const makeVariantRow = variant => {
  const label = S.prop("label")(variant)
  const quantity = S.prop("quantity")(variant)
  const packLabel = S.prop("pack_label")(variant)
  const packSize = S.prop("pack_size")(variant)
  const subtotal = S.prop("price")(variant) * quantity * packSize
  return `+${quantity}  ${label} ${packLabel}: ${currency.format(subtotal)}`
}

const grabMessageTemplate = format => key => {
  const header = `
                _
    ____  _____(_)___ ___  ____ _
   / __ \\/ ___/ / __ \`__ \\/ __ \`/
  / /_/ / /  / / / / / / / /_/ /
 / .___/_/  /_/_/ /_/ /_/\\____/
/_/
`
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
Já estamos preparando tudo para darmos continuidade no seu pedido. Agora é só aguardar que nosso time vai entrar em contato.\n\n

Você comprou:\n

${S.unlines(pV)}

Total: ${currency.format(data.cart.total)}\n

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

Total: ${currency.format(data.cart.total)}
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

const makeMessage = data => {
  const key = S.prop("key")(data)

  return {
    to: isDev ? bruxo : [S.prop("to")(data), "fabio@prima.market", "gustavo@prima.market", "jubiracy@prima.market", "guilherme@prima.market", "dev@prima.market", "tdasilva@tuta.io"],
    from: "no-reply@prima.market",
    subject: S.prop("subject")(data),
    text: grabPlainMessageTemplate(key)(data),
    html: grabHtmlMessageTemplate(key)(data),
  }
}

export default async (req, res) => {
  if (req.method === "POST") {
    const msgData = S.parseJson(S.is($.Object))(S.prop("body")(req))
    if (S.isNothing(msgData))
      return res.status(400).json({ error: "Não pude encontrar os dados necessários para o envio do email. Tente novamente." })

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const data = S.maybeToNullable(msgData)

    const message = makeMessage(data)

    sgMail.send(message, true)

    return res.status(200).json({ success: "Email enviado com sucesso." })
  } else {
    return res.status(400).json({ error: "Método inválido. Admins foram notificados." })
  }
}
