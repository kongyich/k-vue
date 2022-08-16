import { ShapeFlags } from "../shared/shapeFlags"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export const createVNode = function(type, props?, children?) {
  const vnode = {
    type,
    props,
    shapeFlag: getShapeFlag(type),
    children
  }

  if(typeof children === 'string') {
    // vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
  } else if(Array.isArray(children)) {
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN
  }

  if(vnode.shapeFlag & ShapeFlags.STATAFUL_COMPONENT) {
    if(typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
    }
  }

  return vnode
}


function getShapeFlag(type) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATAFUL_COMPONENT
} 

export const createTextVNode = function(text) {
  return createVNode(Text, {}, text)
}
