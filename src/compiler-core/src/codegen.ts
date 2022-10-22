import { isString } from "../../shared"
import { NodeTypes } from "./ast"
import { CREATE_ELEMENT_VNODE, helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

export const generate = function (ast) {
  const context = createCodegenContext()
  const { push } = context

  genFunctionPreamble(ast, context)

  const functionName = 'render'
  const args = ['_ctx', '_cache']
  const signature = args.join(',')

  push(`function ${functionName}(${signature}){`)
  push('return ')
  genNode(ast.codegenNode, context)
  push('}')

  return {
    code: context.code
  }
}

const genFunctionPreamble = function (ast, context) {
  const { push } = context
  const VueBinging = 'Vue'

  const aliasHelper = s => `${helperMapName[s]}: _${helperMapName[s]}`

  if (ast.helpers.length > 0) {
    push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinging}`)
  }

  push('\n')
  push('return ')
}

const createCodegenContext = function () {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
    helper(key) {
      return `_${helperMapName[key]}`
    }
  }

  return context
}

const genNode = function (node, context) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    case NodeTypes.ELEMENT: // 新增
      genElement(node, context) // 新增
      break
    case NodeTypes.COMPOUND_EXPRESSION: // 新增
      genCompoundExpression(node, context) // 新增
      break
    default:
      break
  }
}

// 新增
const genCompoundExpression = function (node, context) {
  const { push } = context
  const children = node.children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (isString(child)) {
      push(child)
    } else {
      genNode(child, context)
    }
  }
}

// 新增
const genElement = function (node, context) {
  const { push, helper } = context
  const { tag, children, props } = node
  push(`${helper(CREATE_ELEMENT_VNODE)}(`)
  genNodeList(genNullable([tag, props, children]), context)
  push(')')
}

// 新增
const genNodeList = function (nodes, context) {
  const { push } = context

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]

    if (isString(node)) {
      push(node)
    } else {
      genNode(node, context)
    }

    if (i < nodes.length - 1) {
      push(', ')
    }
  }
}

// 新增
const genNullable = function (args) {
  return args.map(arg => arg || 'null')
}


const genInterpolation = function (node, context) {
  const { push, helper } = context

  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(')')
}

const genExpression = function (node, context) {
  const { push } = context
  push(`${node.content}`)
}

const genText = function (node, context) {
  const { push } = context
  push(`${node.content}`)
}
