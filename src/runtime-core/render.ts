import { effect } from "../reactivity/effect"
import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp"
import { Fragment, Text } from "./vnode"
   
export function createRender(options) {

  const { createElement, patchProp, insert } = options

  function render(vnode, container) {
    patch(null, vnode, container, null)
  }


  function patch(n1, n2, container, parentComponent) {

    // 判断vnode是否为element类型
    const { type, shapeFlag } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATAFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
    }

  }

  function processElement(n1, n2, container, parentComponent) {
    if(!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }

  function patchElement(n1, n2, container) {
    console.log('patchElement');
    console.log(n1);
    console.log(n2);
  }

  function mountElement(vnode, container, parentComponent) {
    let el = (vnode.el = document.createElement(vnode.type))

    const { children, shapeFlag } = vnode

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }

    const { props } = vnode
    for (let key in props) {
      let val = props[key]

      patchProp(el, key, val)

      // const isOn = key => /^on[A-Z]/.test(key)

      // if(isOn(key)) {
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
    }

    // container.append(el)
    insert(el, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(e => {
      patch(null, e, container, parentComponent)
    })
  }

  function processComponent(n1, n2, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(vnode: any, container, parentComponent) {
    const instance = createComponentInstance(vnode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, vnode, container)
  }

  function setupRenderEffect(instance, vnode, container) {
    effect(()=>{
      if(!instance.isMounted) {
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        patch(null, subTree, container, instance)
        vnode.el = subTree.el

        instance.isMounted = true
      } else {
        console.log('update');

        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree

        instance.subTree = subTree

        patch(prevSubTree, subTree, container, instance)
      }
    })
  }



  function processFragment(n1, n2, container: any, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode
    const textNode = (vnode.el = document.createTextNode(children))
    container.append(textNode)
  }

  return {
    createApp: createAppApi(render)
  }
}
