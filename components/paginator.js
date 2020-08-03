import React from "react"
import { Button, Heading, majorScale, Pane } from "evergreen-ui"

const S = require("sanctuary")

const Paginator = ({ currentPage, setCurrentPage, numPages, totalResults }) => {
    return (
        <Pane margin={majorScale(2)} display="flex" flexDirection="column">
            <Heading size={400} marginBottom={majorScale(2)}>{totalResults} produtos encontrados</Heading>
            <Pane display="flex" flexWrap="wrap" alignItems="center" justifyContent="start" height={majorScale(4)} overflowY="auto">
                {S.map(p => (
                    <Button isActive={S.equals(p)(currentPage)} key={p}
                        onClick={() => setCurrentPage(p)} marginBottom={majorScale(1)} marginRight={majorScale(1)}>{p}</Button>
                ))(S.range(1)(numPages + 1))}
            </Pane>
        </Pane>
    )
}

export default Paginator
