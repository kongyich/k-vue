import { h } from "../../lib/k-vue.esm.js"
import ArrayToArray from "./ArrayToArray.js"

export const App = {
  name: 'App',
  setup() {},
  render() {
    return h('div', {
      id: 'root'
    },
    [
      h(ArrayToArray)
    ])
  }
}
