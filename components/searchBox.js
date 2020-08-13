import { Button, Card, Heading, majorScale, Pane, SearchInput, SearchIcon, Text, minorScale } from "evergreen-ui"
import Link from "next/link"
import { useState } from "react"
import { brand, palette } from "../theme"

const S = require("sanctuary")

const SearchBox = () => {
  const [query, setQuery] = useState("")

  const quote = q => (`\"${q}\"`)

  const lightPrimary = S.prop("base")(palette)

  return (
    <Card display="flex" elevation={1} margin={majorScale(2)} padding={majorScale(1)} alignItems="center" justifyContent="flex-start" background={brand}>
      <Pane marginX={majorScale(2)}>
        <Link href="/">
          <Heading size={100} color="white" style={{ cursor: "pointer" }}>PRIMA</Heading>
        </Link>
      </Pane>
      <Pane flex="1" display="flex" justifyContent="flex-end">
        <form>
          <SearchInput placeholder="Buscar produto" onChange={e => setQuery(e.target.value)} flex="1" />
          <Link  href={{ pathname: "/search", query: { keyword: quote(query) } }}><Button marginLeft={ majorScale(1) } style={{ background: `${lightPrimary}`, color: "white" }} iconAfter={SearchIcon}>Buscar</Button></Link>
        </form>
      </Pane>
      {/* <Pane marginLeft={majorScale(2)}> */}
      {/* </Pane> */}
    </Card>
  )
}

export default SearchBox