import { h } from "../../lib/k-vue.esm.js"

export const App = {
  
  render() {
    return h('div', {
      id: 'root',
      class: ['red', 'hard']
    }, 
    [h('div', { class: 'blue' }, 'son1'), h('p', { class: 'pink' }, 'son2')]
    )
  },

  setup() {
    return {
      msg: 'k-vue'
    }
  }
}
