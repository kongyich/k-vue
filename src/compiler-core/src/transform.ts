import { NodeTypes } from './ast' 
import { TO_DISPLAY_STRING } from './runtimeHelpers'


export const transform = function(root, options = {}) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)

  createRootCodegen(root)

  root.helpers = [...context.helpers.keys()]; // 新增
}
// 保存值
const createRootCodegen = function(root) {
  root.codegenNode = root.children[0]
}

const createTransformContext = function(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(), // 新增
    helper(key) { // 新增
      context.helpers.set(key) // 新增
    }
  }

  return context
}

const traverseNode = function(node, context) {
  const nodeTransforms = context.nodeTransforms
  for(let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    transform(node)
  }

  // traverseChildren(node, context)
  switch(node.type) { // 新增
    case NodeTypes.INTERPOLATION: // 新增
      context.helper(TO_DISPLAY_STRING) // 新增
      break
    case NodeTypes.ROOT: // 新增
    case NodeTypes.TEXT: // 新增
      traverseChildren(node, context) // 新增
      break
    default: 
      break
  }
}

const traverseChildren = function(node, context) {
  const children = node.children

  if(children) {
    for(let i = 0; i < children.length; i++) {
      const node = children[i]
      traverseNode(node, context)
    }
  }
}
