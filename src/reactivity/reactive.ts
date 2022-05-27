import { mutableHandlers, readOnlyHandlers } from "./baseHandlers"


export const reactive = function(raw: object){
  return createActiveObject(raw, mutableHandlers)
}



export const readOnly = function(raw) {
  return createActiveObject(raw, readOnlyHandlers)
}


const createActiveObject = function(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}
