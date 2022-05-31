
import { isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readOnly } from './reactive'

const get = createGetter()
const set = createSetter()
const readOnlyGet = createGetter(true)

function createGetter(isReadOnly=false) {
  return function get(target, key) {

    if(key === ReactiveFlags.IS_REACTIVE) {
      return !isReadOnly
    } else if(key === ReactiveFlags.IS_READONLY) {
      return isReadOnly
    }

    const res = Reflect.get(target, key)

    // 判断res是否为object
    if(isObject(res)) {
      return isReadOnly ? readOnly(res) : reactive(res)
    }

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
  get: readOnlyGet,
  set(target, key, value) {
    // error
    console.warn(`${key}不可以set`)
    return true
  }
}
