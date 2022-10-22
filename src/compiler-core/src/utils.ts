import { NodeTypes } from "./ast"


export const isText = function (node) {
  return (
    node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION
  )
}
