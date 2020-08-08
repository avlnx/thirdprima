const S = require ("sanctuary")
const $ = require ("sanctuary-def")

///////////////////////////////////////////////////////////////////// LISTS
export const id = S.prop("_id")

export const findByIdInList = objId => S.find(obj => S.equals(id(obj))(objId))

////////////////////////////////////////////////////////////////////// NUMBERS
export const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/////////////////////////////////////////////////////////////////////// OBJECTS
// stringProp :: String -> Maybe Any
export const stringProp = str => S.get(S.is($.String))(str) 