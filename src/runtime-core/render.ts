import { effect } from "../reactivity/effect"
import { EMPTY_OBJ, isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp"
import { Fragment, Text } from "./vnode"
   
export function createRender(options) {

  const { createElement, patchProp, insert, remove, setElementText } = options

  function render(vnode, container) {
    patch(null, vnode, container, null, null)
  }


  function patch(n1, n2, container, parentComponent, anchor) {

    // 判断vnode是否为element类型
    const { type, shapeFlag } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlag & ShapeFlags.STATAFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor)
        }
    }

  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    if(!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }


  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log('patchElement');

    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)

    patchProps(el, oldProps, newProps)
    patchChildren(n1, n2, el, parentComponent, anchor)
  }

  function patchChildren(n1: any, n2: any, container, parentComponent, anchor) {
    const shapeFlag = n2.shapeFlag
    const prevShapeFlag = n1.shapeFlag
    const c1 = n1.children
    const c2 = n2.children

    if(shapeFlag & shapeFlag.TEXT_CHILDREN) {
      if(prevShapeFlag & shapeFlag.ARRAY_CHILDREN) {
        unmountChildren(n1.children)
      } 
      if(c1 !== c2) {
        setElementText(container, c2)
      }

    } else {
      if(prevShapeFlag & shapeFlag.TEXT_CHILDREN) {

        setElementText(container, "")
        mountChildren(c2, container, parentComponent, anchor)
      } else {

        // children -> text
        patchKeysChildren(c1, c2, container, parentComponent, anchor)


      }
    }
  }

  // prev: array  ->  next:array
  function patchKeysChildren(c1, c2, container, parentComponent, parentAnchor) {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1
    let e2 = l2 - 1

    function isSameVNode(n1, n2) {
      return n1.type === n1.type && n1.key === n2.key
    }

    // 左侧
    while(i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]

      if(isSameVNode(n1, n2)) {
         patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      i++
    }


    // 右侧
    while(i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if(isSameVNode(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }

      e1--
      e2--
    }


    if(i > e1) {
      if(i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos > l2 ? null : c2[nextPos].el
        while(i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if(i > e2) {
      while(i <= e1) {
        remove(c1[i].el)
        i++
      }
    } else {
      // 乱序
    }

    console.log(i)
  }


  function unmountChildren(children) {
    for(let i = 0; i < children.length; i++) {
      const el = children[i].el

      remove(el)
    }
  }

  function patchProps(el, oldProps, newProps) {

    if(oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]
  
        if(prevProp !== nextProp) {
          patchProp(el, key, prevProp. nextProp)
        }
      }
  
      if(oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if(!(key in newProps)) {
            patchProp(el, key, oldProps[key], null)
          }
        }
      }
      
    }
    
  }

  function mountElement(vnode, container, parentComponent, anchor) {
    let el = (vnode.el = document.createElement(vnode.type))

    const { children, shapeFlag } = vnode

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent, anchor)
    }

    const { props } = vnode
    for (let key in props) {
      let val = props[key]

      patchProp(el, key, null, val)

      // const isOn = key => /^on[A-Z]/.test(key)

      // if(isOn(key)) {
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
    }

    // container.append(el)
    insert(el, container, anchor)
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach(e => {
      patch(null, e, container, parentComponent, anchor)
    })
  }

  function processComponent(n1, n2, container: any, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor)
  }

  function mountComponent(vnode: any, container, parentComponent, anchor) {
    const instance = createComponentInstance(vnode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, vnode, container, anchor)
  }

  function setupRenderEffect(instance, vnode, container, anchor) {
    effect(()=>{
      if(!instance.isMounted) {
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        patch(null, subTree, container, instance, anchor)
        vnode.el = subTree.el

        instance.isMounted = true
      } else {
        console.log('update');

        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree

        instance.subTree = subTree

        patch(prevSubTree, subTree, container, instance, anchor)
      }
    })
  }



  function processFragment(n1, n2, container: any, parentComponent, anchor) {
    mountChildren(n2.children, container, parentComponent, anchor)
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
