export const transform = function(root, options) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
}


const createTransformContext = function(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || []
  }

  return context
}

const traverseNode = function(node, context) {
  const nodeTransforms = context.nodeTransforms
  for(let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    transform(node)
  }

  traverseChildren(node, context)
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
