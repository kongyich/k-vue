

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {}
  }

  return component
}


export function setupComponent(instance) {

  // initProps
  // initSlots
  setupStatefulComponent(instance)

}

function setupStatefulComponent(instance: any) {
  const Component = instance.type

  const { setup } = Component

  instance.proxy = new Proxy({}, {
    get(target, key) {
      const { setupState } = instance

      if(key in setupState) {
        return setupState[key]
      }
    }
  })

  if(setup) {
    let setupResult = setup()

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
