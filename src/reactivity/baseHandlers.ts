
import { track, trigger } from './effect'

const get = createGetter()
const set = createSetter()

function createGetter(isReadOnly=false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)

    if(!isReadOnly) {
      track(target, key)
    }
    // 收集依赖
    
    return res
  }
}


function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readOnlyHandlers = {
  get,
  set(target, key, value) {
    // error
    console.warn(`${key}不可以set`)
    return true
  }
}
