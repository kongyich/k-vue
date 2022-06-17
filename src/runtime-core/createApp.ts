import { createVNode } from "./vnode"
import { render } from "./render"


export const createApp = function(rootComponent) {
  return {
    mount(rootContainer) {
      // 先转换为vnode
      // 后续所有的操作都会基于vnode进行处理
      // component -> vnode

      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)

    }
  }
}
