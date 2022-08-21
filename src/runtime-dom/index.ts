
import { createRender } from "../runtime-core";


const createElement = function(type) {
  return document.createElement(type)
}

const patchProp = function(el, key, value) {
  const isOn = key => /^on[A-Z]/.test(key)

  if(isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, value)
  } else {
    el.setAttribute(key, value)
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
