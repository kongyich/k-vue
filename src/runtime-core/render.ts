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
       // 中间对比
       let s1 = i;
       let s2 = i;
 
       const toBePatched = e2 - s2 + 1;
       let patched = 0;
       const keyToNewIndexMap = new Map();

       let moved = false
       let maxNewIndexSoFar = 0

       const newIndexToOldIndexMap = new Array(toBePatched)
       for(let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
 
       for (let i = s2; i <= e2; i++) {
         const nextChild = c2[i];
         keyToNewIndexMap.set(nextChild.key, i);
       }
 
       for (let i = s1; i <= e1; i++) {
         const prevChild = c1[i];
        
         if (patched >= toBePatched) {
          remove(prevChild.el);
           continue;
         }
 
         let newIndex;
         if (prevChild.key != null) {
           newIndex = keyToNewIndexMap.get(prevChild.key);
         } else {
           for (let j = s2; j <= e2; j++) {
            
             if (isSameVNode(prevChild, c2[j])) {
               newIndex = j;
 
               break;
             }
           }
         }
 
         if (newIndex === undefined) {
           remove(prevChild.el);
         } else {

          if(newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }

          newIndexToOldIndexMap[newIndex - s2] = i + 1

           patch(prevChild, c2[newIndex], container, parentComponent, null);
           patched++;
         }

         const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
         let j = increasingNewIndexSequence.length - 1

         for(let i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = i + s2
          const nextChild = c2[nextIndex]
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null

          if (newIndexToOldIndexMap[i] === 0) {
            patch(null, nextChild, container, parentComponent, anchor);
          } else if(moved) {
            if(j < 0 || i !== increasingNewIndexSequence[j]) {
              // 移动
              insert(nextChild.el, container, anchor)
            } else {
              j--
            }
          }
          
         }


       }
    }

    console.log(i)
  }


  function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = (u + v) >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
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
