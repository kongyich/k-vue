import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"



export function render(vnode, container) {
  patch(vnode, container)
}


function patch(vnode, container) {

  // 判断vnode是否为element类型

  if(typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if(isObject(vnode.type)) {
    processComponent(vnode, container)
  }
 
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  let el = document.createElement(vnode.type)

  const { children } = vnode

  if(typeof children === 'string') {
    el.textContent = children
  } else if(Array.isArray(children)) {
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

  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render()

  patch(subTree, container)
}
