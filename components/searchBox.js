import { Button, Card, Heading, majorScale, Pane, SearchInput, SearchIcon, Text } from "evergreen-ui"
import Link from "next/link"
import { useState } from "react"
import { brand, palette } from "../theme"

const SearchBox = () => {
  const [ query, setQuery ] = useState ("")

  const pq = q => (`\"${q}\"`)

  return (
    <Card display="flex" elevation={1} margin={majorScale(2)} padding={majorScale(1)} alignItems="center" justifyContent="flex-start" background={ brand }>
      <Pane marginX={majorScale (2)}>
        <Heading size={100} color="white">PRIMA</Heading>
      </Pane>
      <Pane flex="1">
        <SearchInput placeholder="Buscar produto" width="100%" onChange={e => setQuery (e.target.value) } />
      </Pane>
      <Pane marginLeft={majorScale(2)}>
        <Link href={`/busca/${pq (query)}`}>
          <Button iconAfter={SearchIcon}>Buscar</Button>
        </Link>
      </Pane>
    </Card>
  )
}

export default SearchBox