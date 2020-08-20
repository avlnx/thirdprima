import { Pane } from "evergreen-ui"
import { primaTheme } from "../theme"
const S = require ("sanctuary")

const ErrorResponse = () => {
  return (
    <>
      <Pane background={S.props(["palette", "purple", "base"])(primaTheme)} display="flex" height="100vh" alignItems="center" justifyContent="center">
        <pre>
|￣￣￣￣￣￣￣￣|<br />
| Aguarde... |<br />
|＿＿＿＿＿ _＿_|<br />
(\__/) ||<br />
(•ㅅ•) ||<br />
/ 　 づ<br />
          <br />
Oi.
Estamos processando seu pedido.<br/>
Caso nada aconteça nos próximos dois minutos<br/>
recarregue a página e tente novamente.
        </pre>
      </Pane>
    </>
  )
}

export default ErrorResponse