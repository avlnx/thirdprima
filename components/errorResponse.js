import { Pane } from "evergreen-ui"
import { primaTheme } from '../theme'
const S = require ("sanctuary")

const ErrorResponse = () => {
  return (
    <>
      <Pane background={S.props(["palette", "purple", "base"])(primaTheme)} display="flex" height="100vh" alignItems="center" justifyContent="center">
        <pre>
|￣￣￣￣￣￣￣￣|<br />
| Ops...      |<br />
|＿＿＿＿＿ _＿_|<br />
(\__/) ||<br />
(•ㅅ•) ||<br />
/ 　 づ<br />
          <br />
Oi.
Parece que estamos sem <br />
internet por aqui. Passa<br />
um cafézinho novo que já voltamos.<br />
        </pre>
      </Pane>
    </>
  )
}

export default ErrorResponse