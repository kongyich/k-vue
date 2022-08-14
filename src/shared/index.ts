export const extend = Object.assign


export const isObject = (val)=>{
  return val !== null && typeof val === 'object'
}


export const hasChanged = (val, newVal)=>!Object.is(val, newVal)
export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)
export const camelize = str => str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
export const toHandlerKey = str => str ? 'on' + capitalize(str) : ''
