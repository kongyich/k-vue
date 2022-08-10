import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"



export function render(vnode, container) {
  patch(vnode, container)
}


function patch(vnode, container) {

  // 判断vnode是否为element类型
  const { shapeFlag } = vnode

  if(shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if(shapeFlag & ShapeFlags.STATAFUL_COMPONENT) {
    processComponent(vnode, container)
  }
 
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  let el = (vnode.el = document.createElement(vnode.type))

  const { children, shapeFlag } = vnode

  if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  const {props} = vnode
  for(let key in props) {
    let val = props[key]
    el.setAttribute(key, val)
  }

  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach(e=>{
    patch(e, container)
  })
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)

  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode,  container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  patch(subTree, container)
  vnode.el = subTree.el
}
