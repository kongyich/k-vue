import { h, ref } from "../../lib/k-vue.esm.js"


// 1. 左侧的对比
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'E' }, 'E'),
// ]


// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
// ]

// const nextChildren = [
//   h('p', { key: 'C' }, 'C'),
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
// ]



const prevChildren = [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
]

const nextChildren = [
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'C' }, 'C'),
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
]


export default {
  name: "ArrayToArray",
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return {
      isChange
    }
  },
  render() {
    const that = this

    return that.isChange === true ? h('div', {}, nextChildren) : h('div', {}, prevChildren)
  }
}
