import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PbulicInstanceProxyHandels } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"


export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: ()=>{}
  }

  component.emit = emit.bind(null, component) as any

  return component
}


export function setupComponent(instance) {

  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)

}

function setupStatefulComponent(instance: any) {
  const Component = instance.type

  const { setup } = Component

  instance.proxy = new Proxy({ _: instance },PbulicInstanceProxyHandels)

  if(setup) {
    setCurrentInstance(instance)
    let setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })
    setCurrentInstance(null)

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult: any) {
  // function object
  if(typeof setupResult === 'object') {
    instance.setupState = setupResult
  } 

  finishComponentSetup(instance)
} 


function finishComponentSetup(instance: any) {
  const Component = instance.type

  if(Component.render) {
    instance.render = Component.render
  }
}

let currentInstance = null
export const getCurrentInstance = function() {
  return currentInstance
}


export function setCurrentInstance(instance) {
  currentInstance = instance
}
