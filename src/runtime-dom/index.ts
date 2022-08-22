
import { createRender } from "../runtime-core";


const createElement = function(type) {
  return document.createElement(type)
}

const patchProp = function(el, key, prevVal, nextVal) {
  const isOn = key => /^on[A-Z]/.test(key)

  if(isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, nextVal)
  } else {

    if(nextVal === undefined || nextVal == null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
    
  }
}

const insert = function(el, parent) {
  parent.append(el)
}

const render: any = createRender({
  createElement,
  patchProp,
  insert
})


export function createApp(...args) {
  return render.createApp(...args)
}

export * from "../runtime-core"
