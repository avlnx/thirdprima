import { Button, Card, Heading, majorScale, Pane, SearchInput, SearchIcon, Text, minorScale } from "evergreen-ui"
import Link from "next/link"
import { useState } from "react"
import { brand, palette } from "../theme"

const S = require("sanctuary")

const SearchBox = () => {
  const [ query, setQuery ] = useState("")
  const [ searching, setSearching ] = useState(false)

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
          <Pane display="flex"  >
            <SearchInput placeholder="Buscar produto" onChange={e => setQuery(e.target.value)} width="auto" />
            <Link  href={{ pathname: "/search", query: { keyword: quote(query) } }}><Button isLoading={searching} onClick={() => setSearching(true)} marginLeft={ majorScale(1) } style={{ background: `${lightPrimary}`, color: "white" }} iconAfter={SearchIcon}>Buscar</Button></Link>
          </Pane>
        </form>
      </Pane>
    </Card>
  )
}

export default SearchBox