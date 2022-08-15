import { ShapeFlags } from "../shared/shapeFlags"


export const initSlots = function(instance, children) {
  const { vnode } = instance

  if(vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key]
    slots[key] = props => normalizeSlotsValue(value(props))
  }
}


function normalizeSlotsValue(value) {
  return  Array.isArray(value) ? value : [value] 
}
