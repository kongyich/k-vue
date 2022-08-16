import { createVNode, Fragment } from "../vnode"

export const renderSlots = function(slots, name, props) {

  let slot = slots[name]

  if(slot) {
    if(typeof slot === 'function') {
      return createVNode(Fragment, {}, slot(props))
    }
  }
  
}
