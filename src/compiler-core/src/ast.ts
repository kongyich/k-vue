import { CREATE_ELEMENT_VNODE } from "./runtimeHelpers"

export const enum NodeTypes {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
  COMPOUND_EXPRESSION
}

export const createVNodeCall = function (context, tag, props, children) {
  context.helper(CREATE_ELEMENT_VNODE)

  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children
  }
}

export const enum TagType {
  START,
  END
}
