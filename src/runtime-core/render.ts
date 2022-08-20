import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"



export function render(vnode, container) {
  patch(vnode, container, null)
}


function patch(vnode, container, parentComponent) {

  // 判断vnode是否为element类型
  const { type, shapeFlag } = vnode

  switch(type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break
    case Text:
      processText(vnode, container)
      break
    default:
      if(shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent)
      } else if(shapeFlag & ShapeFlags.STATAFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent)
      }
  }

  
 
}

function processElement(vnode, container, parentComponent) {
  mountElement(vnode, container, parentComponent)
}

function mountElement(vnode, container, parentComponent) {
  let el = (vnode.el = document.createElement(vnode.type))

  const { children, shapeFlag } = vnode

  if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent)
  }

  const {props} = vnode
  for(let key in props) {
    let val = props[key]

    const isOn = key => /^on[A-Z]/.test(key)

    if(isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  container.append(el)
}

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach(e=>{
    patch(e, container, parentComponent)
  })
}

function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent)
}

function mountComponent(vnode: any, container, parentComponent) {
  const instance = createComponentInstance(vnode, parentComponent)

  setupComponent(instance)

  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode,  container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  patch(subTree, container, instance)
  vnode.el = subTree.el
}



function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent)
}

function processText(vnode: any, container: any) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

