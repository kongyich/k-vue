import { NodeTypes } from "../ast";

export const transformExpression = function(node) {
  if(node.type === NodeTypes.INTERPOLATION) {
    node.content = processExpression(node.content)
  }
}

const processExpression = function(node) {
  node.content = `_ctx.${node.content}`
  return node
}
