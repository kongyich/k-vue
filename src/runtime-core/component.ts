import { shallowReadonly } from "../reactivity/reactive"
import { initProps } from "./componentProps"
import { PbulicInstanceProxyHandels } from "./componentPublicInstance"


export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {}
  }

  return component
}


export function setupComponent(instance) {

  initProps(instance, instance.vnode.props)
  // initSlots
  setupStatefulComponent(instance)

}

function setupStatefulComponent(instance: any) {
  const Component = instance.type

  const { setup } = Component

  instance.proxy = new Proxy({ _: instance },PbulicInstanceProxyHandels)

  if(setup) {
    let setupResult = setup(shallowReadonly(instance.props))

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
