// import connect from "../../lib/db"
const sgMail = require("@sendgrid/mail")

const S = require("sanctuary")
const $ = require("sanctuary-def")

const grabMessageTemplate = format => key => {
  const header = `
                _\n
    ____  _____(_)___ ___  ____ _\n
   / __ \\/ ___/ / __ \`__ \\/ __ \`/\n
  / /_/ / /  / / / / / / / /_/ /\n
 / .___/_/  /_/_/ /_/ /_/\\____/      __\n
/_/  ____ ___  ____ ______/ /_____  / /_\n
    / __ \`__ \\/ __ \`/ ___/ //_/ _ \\/ __/\n
 _ / / / / / / /_/ / /  / ,< /  __/ /_\n
(_)_/ /_/ /_/\\__,_/_/  /_/|_|\\___/\\__/\n
`
  const dir = {
    plain: {
      newPurchase: (data) => `     
${header}
Oi ${S.prop("name")(data)}! Aqui é a Prima.\n
Já estamos preparando tudo para darmos continuidade no seu pedido. Agora é só aguardar que nosso time vai entrar em contato.\n\n

Obrigada pela confiança,\n\n

Prima\n
https://prima.market\n
    `
    },
    html: {
      newPurchase: (data) => `
<pre>${header}</pre>
<p>Oi ${S.prop("name")(data)}! Aqui é a Prima.</p>
<p>Já estamos preparando tudo para darmos continuidade no seu pedido. Agora é só aguardar que nosso time vai entrar em contato.</p>

<p>Obrigada pela confiança,</p>

<p>Prima
<a href="https://prima.market">https://prima.market</a></p>
    `
    }
  }
  return S.prop (key) (S.prop(format)(dir))
}

const grabHtmlMessageTemplate = grabMessageTemplate("html")
const grabPlainMessageTemplate = grabMessageTemplate("plain")

const makeMessage = data => {
  const key = S.prop("key")(data)
  return {
    to: S.prop("to")(data),
    from: "no-reply@prima.market",
    subject: S.prop("subject")(data),
    text: grabPlainMessageTemplate(key)(data),
    html: grabHtmlMessageTemplate(key)(data),
    // html: '<p>Oi! Só pra avisar que já estamos preparando seu pedido ok? Agora é só aguardar nosso contato.<br/><br/>Obrigada,<br/>Prima</p>',
  }
}

export default async (req, res) => {
  if (req.method === "POST") {
    const msgData = S.parseJson(S.is($.Object))(S.prop("body")(req))
    if (S.isNothing(msgData))
      return res.status(400).json({ error: "Não pude encontrar os dados necessários para o envio do email. Tente novamente." })

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const data = S.maybeToNullable(msgData)

    // // debug construct below, replace with data
    // const dataTemplate = {
    //   type: "newPurchase",
    //   to: "tdasilva@tuta.io",
    //   name: "Thyago",
    //   subject: "Seu pedido foi confirmado."
    // }

    sgMail.send(makeMessage(data))

    return res.status(200).json({ success: "Email enviado com sucesso." })
  } else {
    return res.status(400).json({ error: "Método inválido. Admins foram notificados." })
  }
}
