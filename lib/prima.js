const S = require ("sanctuary")
const $ = require ("sanctuary-def")

///////////////////////////////////////////////////////////////////// LISTS
export const id = S.prop("_id")

export const findByIdInList = objId => S.find(obj => S.equals(id(obj))(objId))