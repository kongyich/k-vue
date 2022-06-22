import { mutableHandlers, readOnlyHandlers, shallowReadonlyHandlers } from "./baseHandlers"


export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadOnly"
}

export const reactive = function(raw: object){
  return createActiveObject(raw, mutableHandlers)
}

export const isReactive = function(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}


export const shallowReadonly = function(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers)
}


export const readOnly = function(raw) {
  return createActiveObject(raw, readOnlyHandlers)
}

export const isReadOnly = function(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export const isProxy = function(value) {
  return isReactive(value) || isReadOnly(value)
}


const createActiveObject = function(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}


