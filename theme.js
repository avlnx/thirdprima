
import {
  defaultTheme,
  majorScale,
} from 'evergreen-ui'

const S = require ("sanctuary")

export const palette = S.props (["palette", "purple"]) (defaultTheme)

export const brand = S.props (["palette", "purple", "dark"]) (defaultTheme)

export const primaTheme = {
  ...defaultTheme,
  spinnerColor: brand,
  brand,
  outerPaneGap: majorScale(1),
  primaryButton: {
    backgroundColor: brand,
    backgroundImage: "none",
    color: S.prop("lightest")(palette),
    paddingX: majorScale (2),
    paddingY: majorScale (1),
  }
}
